/**
 * Zero-dependency MQTT 3.1.1 over WebSocket (WSS) Room Relay.
 * Connects simultaneously to multiple global public WSS brokers so that
 * players behind strict Symmetric NAT / 4G-5G CGNAT / Firewalls can always
 * join rooms and exchange real-time game packets with low latency (~60-120ms),
 * running in parallel with WebRTC P2P and BroadcastChannel.
 */

const BROKER_URLS = [
  'wss://broker.emqx.io:8084/mqtt',
  'wss://broker.hivemq.com:8884/mqtt',
];

const TOPIC_PREFIX = 'parroto-vb-room-v2/';

function encodeVarLen(len: number): number[] {
  const out: number[] = [];
  let x = len;
  do {
    let byte = x % 128;
    x = Math.floor(x / 128);
    if (x > 0) byte |= 0x80;
    out.push(byte);
  } while (x > 0);
  return out;
}

function encodeUtf8WithLen(str: string): Uint8Array {
  const bytes = new TextEncoder().encode(str);
  const out = new Uint8Array(2 + bytes.length);
  out[0] = (bytes.length >> 8) & 0xff;
  out[1] = bytes.length & 0xff;
  out.set(bytes, 2);
  return out;
}

function buildConnectPacket(clientId: string): Uint8Array {
  const vh = new Uint8Array([
    0x00, 0x04, 0x4d, 0x51, 0x54, 0x54, // "MQTT"
    0x04, // Protocol level 4 (MQTT 3.1.1)
    0x02, // Clean session
    0x00, 0x3c, // Keepalive 60s
  ]);
  const payload = encodeUtf8WithLen(clientId);
  const remLen = encodeVarLen(vh.length + payload.length);
  const pkt = new Uint8Array(1 + remLen.length + vh.length + payload.length);
  pkt[0] = 0x10; // CONNECT
  pkt.set(remLen, 1);
  pkt.set(vh, 1 + remLen.length);
  pkt.set(payload, 1 + remLen.length + vh.length);
  return pkt;
}

function buildSubscribePacket(topic: string, packetId = 1): Uint8Array {
  const topicBytes = encodeUtf8WithLen(topic);
  const vhLen = 2 + topicBytes.length + 1;
  const remLen = encodeVarLen(vhLen);
  const pkt = new Uint8Array(1 + remLen.length + vhLen);
  let offset = 0;
  pkt[offset++] = 0x82; // SUBSCRIBE (QoS 1 required in header)
  for (const b of remLen) pkt[offset++] = b;
  pkt[offset++] = (packetId >> 8) & 0xff;
  pkt[offset++] = packetId & 0xff;
  pkt.set(topicBytes, offset);
  offset += topicBytes.length;
  pkt[offset] = 0x00; // Requested QoS 0
  return pkt;
}

function buildPublishPacket(topic: string, message: string): Uint8Array {
  const topicBytes = encodeUtf8WithLen(topic);
  const msgBytes = new TextEncoder().encode(message);
  const bodyLen = topicBytes.length + msgBytes.length;
  const remLen = encodeVarLen(bodyLen);
  const pkt = new Uint8Array(1 + remLen.length + bodyLen);
  let offset = 0;
  pkt[offset++] = 0x30; // PUBLISH QoS 0
  for (const b of remLen) pkt[offset++] = b;
  pkt.set(topicBytes, offset);
  offset += topicBytes.length;
  pkt.set(msgBytes, offset);
  return pkt;
}

const PINGREQ_PACKET = new Uint8Array([0xc0, 0x00]);

export class MultiBrokerRoomRelay {
  private sockets: WebSocket[] = [];
  private readySockets = new Set<WebSocket>();
  private pingTimer: number | null = null;
  private outboundQueue: string[] = [];
  private topic: string;
  private onMessageCallback: (data: unknown) => void;
  private onConnectedCallback?: () => void;
  private closed = false;

  constructor(
    roomCode: string,
    onMessage: (data: unknown) => void,
    onConnected?: () => void
  ) {
    this.topic = `${TOPIC_PREFIX}${roomCode.trim().toUpperCase()}`;
    this.onMessageCallback = onMessage;
    this.onConnectedCallback = onConnected;
    this.connectAll();
  }

  private connectAll() {
    if (typeof WebSocket === 'undefined') return;

    for (const url of BROKER_URLS) {
      try {
        const ws = new WebSocket(url, 'mqtt');
        ws.binaryType = 'arraybuffer';
        this.sockets.push(ws);

        let rxBuffer = new Uint8Array(0);

        ws.onopen = () => {
          if (this.closed) {
            ws.close();
            return;
          }
          const clientId = `vb_${Math.random().toString(36).slice(2, 11)}`;
          ws.send(buildConnectPacket(clientId));
        };

        ws.onmessage = (ev) => {
          if (this.closed || !(ev.data instanceof ArrayBuffer)) return;
          const incoming = new Uint8Array(ev.data);
          const merged = new Uint8Array(rxBuffer.length + incoming.length);
          merged.set(rxBuffer, 0);
          merged.set(incoming, rxBuffer.length);
          rxBuffer = merged;

          // Parse all complete MQTT packets in rxBuffer
          while (rxBuffer.length >= 2) {
            const headerByte = rxBuffer[0];
            const packetType = headerByte >> 4;

            let multiplier = 1;
            let remLength = 0;
            let lenBytes = 0;
            let idx = 1;
            let completeHeader = false;

            while (idx < rxBuffer.length && lenBytes < 4) {
              const encodedByte = rxBuffer[idx++];
              lenBytes++;
              remLength += (encodedByte & 127) * multiplier;
              multiplier *= 128;
              if ((encodedByte & 128) === 0) {
                completeHeader = true;
                break;
              }
            }

            if (!completeHeader) break; // Wait for more bytes

            const totalPacketLen = 1 + lenBytes + remLength;
            if (rxBuffer.length < totalPacketLen) break; // Wait for full packet body

            const body = rxBuffer.subarray(1 + lenBytes, totalPacketLen);
            rxBuffer = rxBuffer.subarray(totalPacketLen);

            if (packetType === 2) {
              // CONNACK -> Subscribe to room topic
              ws.send(buildSubscribePacket(this.topic, 1));
            } else if (packetType === 9) {
              // SUBACK -> Ready to send & receive!
              const wasEmpty = this.readySockets.size === 0;
              this.readySockets.add(ws);
              if (wasEmpty && this.onConnectedCallback) {
                this.onConnectedCallback();
              }
              // Flush any queued messages
              if (this.outboundQueue.length > 0) {
                const pending = [...this.outboundQueue];
                this.outboundQueue = [];
                for (const msg of pending) {
                  this.publishRaw(msg);
                }
              }
            } else if (packetType === 3) {
              // PUBLISH -> Extract topic & JSON payload
              if (body.length < 2) continue;
              const topicLen = (body[0] << 8) | body[1];
              const qos = (headerByte >> 1) & 0x03;
              const headerSkip = 2 + topicLen + (qos > 0 ? 2 : 0);
              if (body.length <= headerSkip) continue;
              const payloadBytes = body.subarray(headerSkip);
              try {
                const text = new TextDecoder().decode(payloadBytes);
                const parsed = JSON.parse(text);
                this.onMessageCallback(parsed);
              } catch {
                // Ignore malformed JSON
              }
            }
          }
        };

        ws.onclose = () => {
          this.readySockets.delete(ws);
        };

        ws.onerror = () => {
          this.readySockets.delete(ws);
        };
      } catch {
        // Ignore individual broker init failure
      }
    }

    this.pingTimer = window.setInterval(() => {
      for (const ws of this.readySockets) {
        if (ws.readyState === WebSocket.OPEN) {
          try {
            ws.send(PINGREQ_PACKET);
          } catch {
            // Ignore
          }
        }
      }
    }, 20000);
  }

  private publishRaw(jsonStr: string) {
    const pkt = buildPublishPacket(this.topic, jsonStr);
    for (const ws of this.readySockets) {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(pkt);
        } catch {
          // Ignore send error
        }
      }
    }
  }

  public send(data: unknown) {
    if (this.closed) return;
    const jsonStr = JSON.stringify(data);
    if (this.readySockets.size === 0) {
      this.outboundQueue.push(jsonStr);
      return;
    }
    this.publishRaw(jsonStr);
  }

  public close() {
    this.closed = true;
    if (this.pingTimer) {
      window.clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
    for (const ws of this.sockets) {
      try {
        ws.close();
      } catch {
        // Ignore
      }
    }
    this.sockets = [];
    this.readySockets.clear();
    this.outboundQueue = [];
  }
}
