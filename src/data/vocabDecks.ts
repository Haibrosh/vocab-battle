import { DeckId, VocabCard } from '../types/game';

export interface DeckMeta {
  id: DeckId;
  nameVi: string;
  nameEn: string;
  descVi: string;
  descEn: string;
  badge: string;
  color: string;
  icon: string;
  cardCount: number;
}

export const TOTAL_PARROTO_CARDS = 15397;

export const DECK_LIST: DeckMeta[] = [
  {
    id: 'all',
    nameVi: 'Tất Cả 15 Bộ Từ (Tổng Hợp)',
    nameEn: 'All 15 Decks (Mixed 15,397 Words)',
    descVi: 'Trộn ngẫu nhiên từ kho 15,397 từ vựng IELTS, TOEIC, Oxford 3000/5000, TOEFL, SAT & THPT',
    descEn: 'Randomly mixed from all 15,397 words across IELTS, TOEIC, Oxford, TOEFL & SAT',
    badge: 'MIXED',
    color: 'from-purple-600 to-pink-600',
    icon: '🔥',
    cardCount: TOTAL_PARROTO_CARDS,
  },
  {
    id: 'common-1000',
    nameVi: '1000 Từ Tiếng Anh Thông Dụng',
    nameEn: '1000 Common English Words',
    descVi: 'Bộ 1000 từ vựng tiếng Anh thông dụng nhất trong đời sống hàng ngày của Parroto',
    descEn: 'Top 1000 most common English words in everyday life',
    badge: 'A1 - B1',
    color: 'from-amber-500 to-orange-500',
    icon: '🌟',
    cardCount: 934,
  },
  {
    id: 'conversation',
    nameVi: 'Từ Vựng Tiếng Anh Giao Tiếp',
    nameEn: 'English Conversation Vocabulary',
    descVi: 'Từ vựng phản xạ giao tiếp thực tế, hội thoại công việc & đời sống hàng ngày',
    descEn: 'Practical English conversation vocabulary for daily life and work',
    badge: 'A2 - B1',
    color: 'from-yellow-500 to-amber-500',
    icon: '💬',
    cardCount: 708,
  },
  {
    id: 'oxford-3000-a1',
    nameVi: 'Từ Vựng Oxford 3000 (A1)',
    nameEn: 'Oxford 3000 Vocabulary (A1)',
    descVi: 'Từ vựng nền tảng Oxford 3000 cấp độ A1 dành cho mọi trình độ',
    descEn: 'Core Oxford 3000 A1 foundation vocabulary',
    badge: 'A1',
    color: 'from-emerald-500 to-green-600',
    icon: '📗',
    cardCount: 757,
  },
  {
    id: 'oxford-3000-a2',
    nameVi: 'Từ Vựng Oxford 3000 (A2)',
    nameEn: 'Oxford 3000 Vocabulary (A2)',
    descVi: 'Từ vựng cốt lõi Oxford 3000 cấp độ sơ trung cấp A2',
    descEn: 'Core Oxford 3000 A2 elementary-intermediate vocabulary',
    badge: 'A2',
    color: 'from-teal-500 to-emerald-600',
    icon: '📘',
    cardCount: 827,
  },
  {
    id: 'oxford-b1-b2',
    nameVi: 'Từ Vựng Oxford 3000 (B1 - B2)',
    nameEn: 'Oxford 3000 Vocabulary (B1 - B2)',
    descVi: 'Hơn 1,050 từ vựng trung cấp Oxford 3000/5000 trọng tâm B1 - B2',
    descEn: '1,050+ intermediate Oxford 3000/5000 B1-B2 vocabulary words',
    badge: 'B1 - B2',
    color: 'from-cyan-500 to-blue-600',
    icon: '📙',
    cardCount: 1054,
  },
  {
    id: 'oxford-c1-c2',
    nameVi: 'Từ Vựng Oxford 5000 (B2 - C2)',
    nameEn: 'Oxford 5000 Advanced (B2 - C2)',
    descVi: '1,200 từ vựng nâng cao Oxford 5000 & học thuật chuyên sâu B2 - C2',
    descEn: '1,200 advanced Oxford 5000 & academic C1-C2 words',
    badge: 'C1 - C2',
    color: 'from-indigo-600 to-violet-600',
    icon: '📕',
    cardCount: 1200,
  },
  {
    id: 'toeic-600',
    nameVi: '600 Từ Vựng Thiết Yếu TOEIC',
    nameEn: '600 Essential Words for TOEIC',
    descVi: 'Bộ 600 từ vựng TOEIC chính thức của Parroto theo 29 chủ đề thương mại',
    descEn: 'Official 600 essential TOEIC words across 29 business topics',
    badge: 'B1 - B2',
    color: 'from-blue-500 to-indigo-500',
    icon: '💼',
    cardCount: 616,
  },
  {
    id: 'ets-toeic',
    nameVi: 'Từ Vựng ETS TOEIC 800 - 900+',
    nameEn: 'ETS TOEIC 800 - 900+ Vocabulary',
    descVi: '2,158 từ vựng luyện thi ETS TOEIC thực chiến mục tiêu 800 - 990',
    descEn: '2,158 intensive ETS TOEIC words for 800 - 990 target score',
    badge: 'B2 - C1',
    color: 'from-sky-500 to-blue-700',
    icon: '🏢',
    cardCount: 2158,
  },
  {
    id: 'ielts-600',
    nameVi: '600 Từ Vựng IELTS Cơ Bản',
    nameEn: '600 Essential IELTS Vocabulary',
    descVi: 'Bộ 600 từ vựng học thuật IELTS nền tảng theo 20 chủ đề trọng tâm',
    descEn: '600 core academic IELTS words across 20 essential topics',
    badge: 'B1 - B2',
    color: 'from-rose-500 to-pink-600',
    icon: '🎓',
    cardCount: 596,
  },
  {
    id: 'ielts-band-4-5',
    nameVi: 'Từ Vựng IELTS Band 4.0 - 5.5',
    nameEn: 'IELTS Band 4.0 - 5.5 Vocabulary',
    descVi: 'Bộ 2,086 từ vựng IELTS chính thức trên Parroto chia theo 95 nhóm chủ đề',
    descEn: 'Official 2,086 IELTS Band 4.0 - 5.5 words across 95 topic groups',
    badge: 'B1 - B2',
    color: 'from-orange-500 to-red-500',
    icon: '📝',
    cardCount: 2086,
  },
  {
    id: 'ielts-advanced',
    nameVi: 'Từ Vựng IELTS Band 6.5 - 8.5+',
    nameEn: 'IELTS Band 6.5 - 8.5+ Vocabulary',
    descVi: '2,048 từ vựng IELTS học thuật chuyên sâu cho Reading, Writing & Speaking',
    descEn: '2,048 high-band IELTS academic words for Reading, Writing & Speaking',
    badge: 'C1 - C2',
    color: 'from-red-600 to-rose-700',
    icon: '🏆',
    cardCount: 2048,
  },
  {
    id: 'toefl-essential',
    nameVi: 'Từ Vựng Thiết Yếu Cho TOEFL',
    nameEn: 'Essential TOEFL Vocabulary',
    descVi: 'Bộ 526 từ vựng học thuật TOEFL chính thức theo các chủ đề khoa học & xã hội',
    descEn: 'Official 526 academic TOEFL words across science & humanities',
    badge: 'B2 - C1',
    color: 'from-purple-500 to-indigo-600',
    icon: '🌎',
    cardCount: 526,
  },
  {
    id: 'thpt-qg',
    nameVi: 'Từ Vựng Ôn Thi THPT Quốc Gia',
    nameEn: 'National High School Exam Vocabulary',
    descVi: '1,247 từ vựng & cụm từ trọng tâm bám sát đề thi THPT Quốc Gia & HSG',
    descEn: '1,247 core words and phrases for the National High School Exam',
    badge: 'B1 - B2',
    color: 'from-fuchsia-500 to-pink-600',
    icon: '🏫',
    cardCount: 1247,
  },
  {
    id: 'sat-c1-c2',
    nameVi: 'Từ Vựng SAT & Phrasal Verbs C1-C2',
    nameEn: 'Digital SAT & C1-C2 Mastery',
    descVi: '542 từ vựng Digital SAT, cụm động từ & từ học thuật C1-C2 độ khó cao',
    descEn: '542 Digital SAT vocabulary, C1-C2 phrasal verbs and advanced words',
    badge: 'C1 - C2',
    color: 'from-violet-600 to-purple-800',
    icon: '🧠',
    cardCount: 542,
  },
  {
    id: 'lunar-new-year',
    nameVi: 'Từ Vựng Tết & Văn Hóa Việt Nam',
    nameEn: 'Vietnamese Lunar New Year & Culture',
    descVi: 'Bộ từ vựng chủ đề Tết cổ truyền, phong tục, ẩm thực & văn hóa Việt Nam',
    descEn: 'Vocabulary about Vietnamese Tet, traditions, cuisine & culture',
    badge: 'A2 - B2',
    color: 'from-red-500 to-amber-500',
    icon: '🧧',
    cardCount: 98,
  },
  {
    id: 'custom',
    nameVi: 'Bộ Từ Tự Nhập / Cộng Đồng',
    nameEn: 'Custom / Community Deck',
    descVi: 'Tự nhập danh sách từ hoặc tải từ kho 3,500+ bộ từ cộng đồng Parroto',
    descEn: 'Import your own words or pick from 3,500+ Parroto community decks',
    badge: 'CUSTOM',
    color: 'from-fuchsia-600 to-purple-600',
    icon: '✨',
    cardCount: 0,
  },
];

interface RawCardSeed {
  w: string;
  t: VocabCard['type'];
  d: string;
  l: VocabCard['level'];
  ipa: string;
  vi: string;
  expVi: string;
  expEn: string;
  exEn: string;
  exVi: string;
}

const RAW_SEEDS: RawCardSeed[] = [
  // ==================== IELTS (35 cards) ====================
  {
    w: 'mitigate',
    t: 'verb',
    d: 'ielts',
    l: 'C1',
    ipa: 'ˈmɪtɪɡeɪt',
    vi: 'giảm thiểu, làm dịu bớt',
    expVi: 'Làm cho một vấn đề hoặc hậu quả bớt nghiêm trọng hoặc ít đau đớn hơn',
    expEn: 'To make something less harmful, unpleasant, or bad',
    exEn: 'Planting more trees helps ******** the effects of climate change.',
    exVi: 'Trồng thêm cây xanh giúp giảm thiểu tác động của biến đổi khí hậu.',
  },
  {
    w: 'ubiquitous',
    t: 'adjective',
    d: 'ielts',
    l: 'C1',
    ipa: 'juːˈbɪkwɪtəs',
    vi: 'phổ biến khắp nơi, có mặt ở mọi nơi',
    expVi: 'Xuất hiện hoặc có mặt ở khắp mọi nơi cùng một lúc',
    expEn: 'Seeming to be everywhere or in several places at the same time',
    exEn: 'Smartphones have become ********** in modern society.',
    exVi: 'Điện thoại thông minh đã trở nên phổ biến khắp nơi trong xã hội hiện đại.',
  },
  {
    w: 'deteriorate',
    t: 'verb',
    d: 'ielts',
    l: 'B2',
    ipa: 'dɪˈtɪriəreɪt',
    vi: 'xấu đi, xuống cấp, suy thoái',
    expVi: 'Trở nên tồi tệ hơn về chất lượng, sức khỏe hoặc tình trạng',
    expEn: 'To become worse in quality or condition',
    exEn: 'Air quality in major cities continues to *********** rapidly.',
    exVi: 'Chất lượng không khí ở các thành phố lớn tiếp tục xấu đi nhanh chóng.',
  },
  {
    w: 'sustainable',
    t: 'adjective',
    d: 'ielts',
    l: 'B2',
    ipa: 'səˈsteɪnəbl',
    vi: 'bền vững, thân thiện lâu dài',
    expVi: 'Có thể duy trì lâu dài mà không gây hại cho môi trường hay cạn kiệt tài nguyên',
    expEn: 'Able to continue over a period of time without harming the environment',
    exEn: 'Governments are investing heavily in *********** energy sources.',
    exVi: 'Các chính phủ đang đầu tư mạnh vào các nguồn năng lượng bền vững.',
  },
  {
    w: 'inevitable',
    t: 'adjective',
    d: 'ielts',
    l: 'B2',
    ipa: 'ɪnˈevɪtəbl',
    vi: 'không thể tránh khỏi, tất yếu',
    expVi: 'Chắc chắn sẽ xảy ra và không có cách nào ngăn cản được',
    expEn: 'Certain to happen and unable to be avoided or prevented',
    exEn: 'Technological automation makes job shifts **********.',
    exVi: 'Tự động hóa công nghệ khiến sự dịch chuyển công việc là điều tất yếu.',
  },
  {
    w: 'ambiguous',
    t: 'adjective',
    d: 'ielts',
    l: 'C1',
    ipa: 'æmˈbɪɡjuəs',
    vi: 'mơ hồ, nhập nhằng, đa nghĩa',
    expVi: 'Có nhiều hơn một cách hiểu, không rõ ràng hoặc gây nhầm lẫn',
    expEn: 'Having or expressing more than one possible meaning, sometimes intentionally',
    exEn: 'The wording of the agreement was deliberately *********.',
    exVi: 'Cách diễn đạt của thỏa thuận cố tình được viết một cách mơ hồ.',
  },
  {
    w: 'scrutinize',
    t: 'verb',
    d: 'ielts',
    l: 'C1',
    ipa: 'ˈskruːtənaɪz',
    vi: 'xem xét kỹ lưỡng, soi xét',
    expVi: 'Kiểm tra hoặc quan sát một thứ gì đó cực kỳ cẩn thận đến từng chi tiết',
    expEn: 'To examine someone or something very carefully',
    exEn: 'Auditors will ********** every financial transaction this quarter.',
    exVi: 'Các kiểm toán viên sẽ xem xét kỹ lưỡng mọi giao dịch tài chính quý này.',
  },
  {
    w: 'resilient',
    t: 'adjective',
    d: 'ielts',
    l: 'B2',
    ipa: 'rɪˈzɪliənt',
    vi: 'kiên cường, có khả năng phục hồi nhanh',
    expVi: 'Có khả năng nhanh chóng hồi phục sau khó khăn, biến cố hoặc thay đổi',
    expEn: 'Able to quickly return to a previous good condition after problems',
    exEn: 'Children are often remarkably ********* after facing difficulties.',
    exVi: 'Trẻ em thường có khả năng phục hồi đáng kinh ngạc sau khi gặp khó khăn.',
  },
  {
    w: 'pragmatic',
    t: 'adjective',
    d: 'ielts',
    l: 'C1',
    ipa: 'præɡˈmætɪk',
    vi: 'thực tế, thực dụng',
    expVi: 'Giải quyết vấn đề dựa trên thực tiễn hơn là lý thuyết suông',
    expEn: 'Solving problems in a sensible way that suits the conditions that really exist',
    exEn: 'We need a ********* approach to solve the traffic crisis.',
    exVi: 'Chúng ta cần một cách tiếp cận thực tế để giải quyết khủng hoảng giao thông.',
  },
  {
    w: 'detrimental',
    t: 'adjective',
    d: 'ielts',
    l: 'C1',
    ipa: 'ˌdetrɪˈmentl',
    vi: 'có hại, gây tổn hại',
    expVi: 'Gây ra tác hại hoặc ảnh hưởng xấu đến ai đó hoặc cái gì đó',
    expEn: 'Causing harm or damage',
    exEn: 'Lack of sleep is *********** to both mental and physical health.',
    exVi: 'Thiếu ngủ có hại cho cả sức khỏe tinh thần và thể chất.',
  },
  {
    w: 'fluctuate',
    t: 'verb',
    d: 'ielts',
    l: 'B2',
    ipa: 'ˈflʌktʃueɪt',
    vi: 'dao động, biến động lên xuống',
    expVi: 'Thay đổi liên tục về mức độ, giá cả hoặc số lượng',
    expEn: 'To change, especially continuously and between one level or thing and another',
    exEn: 'Oil prices continue to ********* wildly due to global tensions.',
    exVi: 'Giá dầu tiếp tục biến động mạnh do căng thẳng toàn cầu.',
  },
  {
    w: 'indispensable',
    t: 'adjective',
    d: 'ielts',
    l: 'C1',
    ipa: 'ˌɪndɪˈspensəbl',
    vi: 'không thể thiếu, tối quan trọng',
    expVi: 'Quá quan trọng đến mức không thể làm việc hoặc tồn tại nếu thiếu nó',
    expEn: 'Something or someone that is so good or important that you could not manage without',
    exEn: 'High-speed internet has become ************* for remote workers.',
    exVi: 'Internet tốc độ cao đã trở nên không thể thiếu đối với người làm việc từ xa.',
  },
  {
    w: 'jeopardize',
    t: 'verb',
    d: 'ielts',
    l: 'C1',
    ipa: 'ˈdʒepərdaɪz',
    vi: 'gây nguy hiểm, đe dọa làm hỏng',
    expVi: 'Đặt ai đó hoặc việc gì đó vào tình thế có nguy cơ bị tổn hại hoặc thất bại',
    expEn: 'To put something such as a plan or system in danger of being harmed or damaged',
    exEn: 'Any scandal could ********** the company reputation.',
    exVi: 'Bất kỳ bê bối nào cũng có thể đe dọa làm hỏng danh tiếng công ty.',
  },
  {
    w: 'alleviate',
    t: 'verb',
    d: 'ielts',
    l: 'C1',
    ipa: 'əˈliːvieɪt',
    vi: 'làm giảm bớt, xoa dịu (nỗi đau, khó khăn)',
    expVi: 'Làm cho cơn đau, gánh nặng hoặc vấn đề trở nên nhẹ nhàng hơn',
    expEn: 'To make something bad such as pain or problems less severe',
    exEn: 'The new subway line will help ********* traffic congestion.',
    exVi: 'Tuyến tàu điện ngầm mới sẽ giúp làm giảm bớt tình trạng ùn tắc giao thông.',
  },
  {
    w: 'discrepancy',
    t: 'noun',
    d: 'ielts',
    l: 'C1',
    ipa: 'dɪˈskrepənsi',
    vi: 'sự chênh lệch, sự khác biệt không khớp',
    expVi: 'Sự khác nhau bất thường giữa hai con số hoặc báo cáo lẽ ra phải giống nhau',
    expEn: 'A difference between two things that should be the same',
    exEn: 'There is a major *********** between the two financial reports.',
    exVi: 'Có một sự chênh lệch lớn giữa hai bản báo cáo tài chính.',
  },
  {
    w: 'vulnerable',
    t: 'adjective',
    d: 'ielts',
    l: 'B2',
    ipa: 'ˈvʌlnərəbl',
    vi: 'dễ bị tổn thương, mỏng manh',
    expVi: 'Dễ bị ảnh hưởng xấu hoặc tấn công về thể chất, cảm xúc hoặc hệ thống',
    expEn: 'Able to be easily physically, emotionally, or mentally hurt, influenced, or attacked',
    exEn: 'Coastal towns are particularly ********** to rising sea levels.',
    exVi: 'Các thị trấn ven biển đặc biệt dễ bị tổn thương trước mực nước biển dâng.',
  },
  {
    w: 'feasible',
    t: 'adjective',
    d: 'ielts',
    l: 'B2',
    ipa: 'ˈfiːzəbl',
    vi: 'khả thi, có thể thực hiện được',
    expVi: 'Có thể làm được hoặc đạt được trong thực tế với nguồn lực hiện có',
    expEn: 'Able to be made, done, or achieved',
    exEn: 'Completing the bridge by December is economically ********.',
    exVi: 'Hoàn thành cây cầu trước tháng 12 là hoàn toàn khả thi về mặt kinh tế.',
  },
  {
    w: 'incentive',
    t: 'noun',
    d: 'ielts',
    l: 'B2',
    ipa: 'ɪnˈsentɪv',
    vi: 'động lực khích lệ, sự ưu đãi',
    expVi: 'Điều khuyến khích hoặc thúc đẩy ai đó làm việc chăm chỉ hơn',
    expEn: 'Something that encourages a person to do something',
    exEn: 'Tax breaks provide a strong ********* for startups to innovate.',
    exVi: 'Giảm thuế tạo ra động lực khích lệ mạnh mẽ để các công ty khởi nghiệp đổi mới.',
  },
  {
    w: 'comprehensive',
    t: 'adjective',
    d: 'ielts',
    l: 'B2',
    ipa: 'ˌkɑːmprɪˈhensɪv',
    vi: 'toàn diện, bao quát đầy đủ',
    expVi: 'Bao gồm tất cả hoặc gần như tất cả các khía cạnh liên quan',
    expEn: 'Complete and including everything that is necessary',
    exEn: 'The ministry published a ************* study on public health.',
    exVi: 'Bộ đã công bố một nghiên cứu toàn diện về sức khỏe cộng đồng.',
  },
  {
    w: 'proliferate',
    t: 'verb',
    d: 'ielts',
    l: 'C1',
    ipa: 'prəˈlɪfəreɪt',
    vi: 'sinh sôi, gia tăng nhanh chóng',
    expVi: 'Tăng lên đột biến về số lượng trong thời gian ngắn',
    expEn: 'To increase a lot and suddenly in number',
    exEn: 'Short-form video platforms have begun to *********** globally.',
    exVi: 'Các nền tảng video ngắn đã bắt đầu gia tăng nhanh chóng trên toàn cầu.',
  },
  {
    w: 'unprecedented',
    t: 'adjective',
    d: 'ielts',
    l: 'C1',
    ipa: 'ʌnˈpresɪdentɪd',
    vi: 'chưa từng có tiền lệ',
    expVi: 'Chưa bao giờ xảy ra hoặc tồn tại trước đây trong lịch sử',
    expEn: 'Never having happened or existed in the past',
    exEn: 'The heatwave reached ************* temperatures across Europe.',
    exVi: 'Đợt nắng nóng đã chạm mức nhiệt độ chưa từng có tiền lệ khắp châu Âu.',
  },
  {
    w: 'adversity',
    t: 'noun',
    d: 'ielts',
    l: 'C1',
    ipa: 'ədˈvɜːrsəti',
    vi: 'nghịch cảnh, hoàn cảnh khó khăn',
    expVi: 'Tình huống rất khó khăn, thử thách hoặc kém may mắn trong cuộc sống',
    expEn: 'A difficult or unlucky situation or event',
    exEn: 'She showed tremendous courage in the face of *********.',
    exVi: 'Cô ấy đã thể hiện lòng dũng cảm to lớn khi đối mặt với nghịch cảnh.',
  },
  {
    w: 'exemplify',
    t: 'verb',
    d: 'ielts',
    l: 'C1',
    ipa: 'ɪɡˈzemplɪfaɪ',
    vi: 'minh họa, là ví dụ điển hình cho',
    expVi: 'Đóng vai trò là một ví dụ tiêu biểu hoặc minh chứng rõ nét cho điều gì',
    expEn: 'To be or give a typical example of something',
    exEn: 'These ancient temples ********* the pinnacle of medieval architecture.',
    exVi: 'Những ngôi đền cổ này là ví dụ điển hình cho đỉnh cao kiến trúc thời trung cổ.',
  },
  {
    w: 'consolidate',
    t: 'verb',
    d: 'ielts',
    l: 'C1',
    ipa: 'kənˈsɑːlɪdeɪt',
    vi: 'củng cố, hợp nhất cho vững chắc',
    expVi: 'Làm cho vị thế, quyền lực hoặc kiến thức trở nên mạnh mẽ và vững chắc hơn',
    expEn: 'To become, or cause something to become, stronger and more certain',
    exEn: 'Reviewing vocabulary daily helps *********** long-term memory.',
    exVi: 'Ôn tập từ vựng hàng ngày giúp củng cố trí nhớ dài hạn.',
  },
  {
    w: 'plausible',
    t: 'adjective',
    d: 'ielts',
    l: 'C1',
    ipa: 'ˈplɔːzəbl',
    vi: 'hợp lý, đáng tin cậy',
    expVi: 'Có vẻ hợp lý hoặc có khả năng là sự thật',
    expEn: 'Seeming likely to be true, or able to be believed',
    exEn: 'Scientists proposed a ********* explanation for the phenomenon.',
    exVi: 'Các nhà khoa học đã đề xuất một lời giải thích hợp lý cho hiện tượng này.',
  },
  {
    w: 'substantiate',
    t: 'verb',
    d: 'ielts',
    l: 'C1',
    ipa: 'səbˈstænʃieɪt',
    vi: 'chứng minh bằng bằng chứng xác thực',
    expVi: 'Đưa ra dữ kiện hoặc bằng chứng cụ thể để chứng minh một tuyên bố là đúng',
    expEn: 'To show something to be true, or to support a claim with facts',
    exEn: 'There is little evidence to ************ the rumor.',
    exVi: 'Có rất ít bằng chứng để chứng minh cho tin đồn đó.',
  },
  {
    w: 'catalyst',
    t: 'noun',
    d: 'ielts',
    l: 'C1',
    ipa: 'ˈkætəlɪst',
    vi: 'chất xúc tác, nhân tố thúc đẩy',
    expVi: 'Sự kiện hoặc yếu tố thúc đẩy sự thay đổi lớn diễn ra nhanh hơn',
    expEn: 'An event or person that causes great change',
    exEn: 'The pandemic acted as a ******** for digital transformation.',
    exVi: 'Đại dịch đã đóng vai trò là nhân tố thúc đẩy quá trình chuyển đổi số.',
  },
  {
    w: 'coherent',
    t: 'adjective',
    d: 'ielts',
    l: 'B2',
    ipa: 'koʊˈhɪrənt',
    vi: 'mạch lạc, chặt chẽ, logic',
    expVi: 'Các ý tưởng gắn kết rõ ràng, hợp lý và dễ hiểu',
    expEn: 'If an argument or set of ideas is coherent, it is clear and carefully considered',
    exEn: 'Your essay needs a more ******** structure to score Band 8.',
    exVi: 'Bài luận của bạn cần cấu trúc mạch lạc hơn để đạt điểm Band 8.',
  },
  {
    w: 'empirical',
    t: 'adjective',
    d: 'ielts',
    l: 'C1',
    ipa: 'ɪmˈpɪrɪkl',
    vi: 'thực nghiệm, dựa trên quan sát thực tế',
    expVi: 'Dựa trên kinh nghiệm hoặc thí nghiệm thực tế chứ không chỉ dựa vào lý thuyết',
    expEn: 'Based on what is experienced or seen rather than on theory',
    exEn: 'The theory is supported by extensive ********* evidence.',
    exVi: 'Lý thuyết này được củng cố bởi các bằng chứng thực nghiệm sâu rộng.',
  },
  {
    w: 'paradigm',
    t: 'noun',
    d: 'ielts',
    l: 'C1',
    ipa: 'ˈpærədaɪm',
    vi: 'mô hình chuẩn, hệ tư tưởng',
    expVi: 'Một khuôn mẫu điển hình hoặc cách tiếp cận chuẩn mực đối với một lĩnh vực',
    expEn: 'A model of something, or a very clear and typical example of something',
    exEn: 'Artificial intelligence is creating a new ******** in education.',
    exVi: 'Trí tuệ nhân tạo đang tạo ra một mô hình mới trong giáo dục.',
  },

  // ==================== TOEIC (30 cards) ====================
  {
    w: 'negotiate',
    t: 'verb',
    d: 'toeic',
    l: 'B1',
    ipa: 'nɪˈɡoʊʃieɪt',
    vi: 'đàm phán, thương lượng',
    expVi: 'Thảo luận chính thức với ai đó để đi đến một thỏa thuận chung',
    expEn: 'To have formal discussions with someone in order to reach an agreement',
    exEn: 'Our legal team will ********* the terms of the new contract.',
    exVi: 'Đội ngũ pháp lý của chúng tôi sẽ đàm phán các điều khoản của hợp đồng mới.',
  },
  {
    w: 'reimburse',
    t: 'verb',
    d: 'toeic',
    l: 'B2',
    ipa: 'ˌriːɪmˈbɜːrs',
    vi: 'hoàn trả lại tiền, bồi hoàn chi phí',
    expVi: 'Trả lại số tiền mà nhân viên hoặc ai đó đã chi tiêu cho công việc',
    expEn: 'To pay back money to someone who has spent it for you',
    exEn: 'The company will ********* all travel expenses upon receipt.',
    exVi: 'Công ty sẽ hoàn trả mọi chi phí đi lại khi có hóa đơn.',
  },
  {
    w: 'itinerary',
    t: 'noun',
    d: 'toeic',
    l: 'B2',
    ipa: 'aɪˈtɪnəreri',
    vi: 'lịch trình chuyến đi, hành trình',
    expVi: 'Kế hoạch chi tiết cho một chuyến công tác hoặc du lịch, gồm thời gian và địa điểm',
    expEn: 'A detailed plan or route of a journey',
    exEn: 'Please check the attached ********* for the Tokyo conference.',
    exVi: 'Vui lòng kiểm tra lịch trình đính kèm cho hội nghị tại Tokyo.',
  },
  {
    w: 'tentative',
    t: 'adjective',
    d: 'toeic',
    l: 'B2',
    ipa: 'ˈtentətɪv',
    vi: 'dự kiến, tạm thời (chưa chốt cố định)',
    expVi: 'Kế hoạch hoặc lịch hẹn mang tính tạm thời và có thể thay đổi sau',
    expEn: 'Of a plan or idea not certain or agreed, or a suggestion made hesitantly',
    exEn: 'We have set a ********* date for the product launch.',
    exVi: 'Chúng tôi đã đặt một ngày dự kiến cho buổi ra mắt sản phẩm.',
  },
  {
    w: 'compliance',
    t: 'noun',
    d: 'toeic',
    l: 'B2',
    ipa: 'kəmˈplaɪəns',
    vi: 'sự tuân thủ (quy định, pháp luật)',
    expVi: 'Hành động làm đúng theo luật lệ, tiêu chuẩn hoặc yêu cầu bắt buộc',
    expEn: 'The act of obeying an order, rule, or request',
    exEn: 'Safety helmets must be worn in ********** with factory regulations.',
    exVi: 'Mũ bảo hộ phải được đội để tuân thủ quy định của nhà máy.',
  },
  {
    w: 'delegate',
    t: 'verb',
    d: 'toeic',
    l: 'B2',
    ipa: 'ˈdelɪɡeɪt',
    vi: 'ủy quyền, giao phó công việc',
    expVi: 'Trao một phần công việc hoặc trách nhiệm cho cấp dưới thực hiện',
    expEn: 'To give a particular job, duty, right, etc. to someone else so that they do it for you',
    exEn: 'Good managers know how to ******** tasks effectively.',
    exVi: 'Những người quản lý giỏi biết cách giao phó công việc hiệu quả.',
  },
  {
    w: 'merchandise',
    t: 'noun',
    d: 'toeic',
    l: 'B2',
    ipa: 'ˈmɜːrtʃəndaɪs',
    vi: 'hàng hóa thương mại',
    expVi: 'Các sản phẩm được mua và bán trong hoạt động kinh doanh',
    expEn: 'Goods that are bought and sold',
    exEn: 'Damaged *********** can be exchanged within thirty days.',
    exVi: 'Hàng hóa bị hư hỏng có thể được đổi trả trong vòng 30 ngày.',
  },
  {
    w: 'warranty',
    t: 'noun',
    d: 'toeic',
    l: 'B1',
    ipa: 'ˈwɔːrənti',
    vi: 'giấy bảo hành, chế độ bảo hành',
    expVi: 'Cam kết bằng văn bản của nhà sản xuất về việc sửa chữa hoặc thay thế sản phẩm lỗi',
    expEn: 'A written promise from a company to repair or replace a product if it breaks',
    exEn: 'The laptop comes with a two-year international ********.',
    exVi: 'Chiếc laptop đi kèm với chế độ bảo hành quốc tế hai năm.',
  },
  {
    w: 'subsidiary',
    t: 'noun',
    d: 'toeic',
    l: 'C1',
    ipa: 'səbˈsɪdieri',
    vi: 'công ty con',
    expVi: 'Một công ty thuộc quyền sở hữu và kiểm soát của một tập đoàn lớn hơn',
    expEn: 'A company that is owned by a larger company',
    exEn: 'The corporation opened a new ********** in Singapore.',
    exVi: 'Tập đoàn đã mở một công ty con mới tại Singapore.',
  },
  {
    w: 'invoice',
    t: 'noun',
    d: 'toeic',
    l: 'B1',
    ipa: 'ˈɪnvɔɪs',
    vi: 'hóa đơn thanh toán',
    expVi: 'Danh sách hàng hóa hoặc dịch vụ đã cung cấp kèm số tiền cần thanh toán',
    expEn: 'A list of things provided or work done together with their cost, for payment',
    exEn: 'Please settle the attached ******* within fourteen business days.',
    exVi: 'Vui lòng thanh toán hóa đơn đính kèm trong vòng 14 ngày làm việc.',
  },
  {
    w: 'prerequisite',
    t: 'noun',
    d: 'toeic',
    l: 'C1',
    ipa: 'ˌpriːˈrekwəzɪt',
    vi: 'điều kiện tiên quyết',
    expVi: 'Điều bắt buộc phải có hoặc hoàn thành trước khi việc khác có thể diễn ra',
    expEn: 'Something that must exist or happen before something else can exist or happen',
    exEn: 'Fluency in English is a ************ for this international role.',
    exVi: 'Thông thạo tiếng Anh là điều kiện tiên quyết cho vị trí quốc tế này.',
  },
  {
    w: 'renovate',
    t: 'verb',
    d: 'toeic',
    l: 'B1',
    ipa: 'ˈrenəveɪt',
    vi: 'cải tạo, tân trang, nâng cấp',
    expVi: 'Sửa chữa và làm mới lại một tòa nhà hoặc văn phòng cũ',
    expEn: 'To repair and improve something, especially a building',
    exEn: 'The hotel will close for two months to ******** the lobby.',
    exVi: 'Khách sạn sẽ đóng cửa hai tháng để cải tạo lại sảnh chính.',
  },
  {
    w: 'confidential',
    t: 'adjective',
    d: 'toeic',
    l: 'B2',
    ipa: 'ˌkɑːnfɪˈdenʃl',
    vi: 'tuyệt mật, bảo mật',
    expVi: 'Cần được giữ bí mật, không được tiết lộ cho người ngoài',
    expEn: 'Secret, often in a formal, business, or military situation',
    exEn: 'All client records must be kept strictly ************.',
    exVi: 'Tất cả hồ sơ khách hàng phải được giữ bảo mật tuyệt đối.',
  },
  {
    w: 'postpone',
    t: 'verb',
    d: 'toeic',
    l: 'B1',
    ipa: 'poʊˈspoʊn',
    vi: 'trì hoãn, dời lịch lại sau',
    expVi: 'Dời một sự kiện hoặc cuộc họp sang một thời điểm muộn hơn',
    expEn: 'To delay an event and plan or decide that it should happen at a later date',
    exEn: 'We had to ******** the board meeting until next Wednesday.',
    exVi: 'Chúng tôi đã phải dời lịch cuộc họp hội đồng quản trị sang thứ Tư tuần sau.',
  },
  {
    w: 'accommodate',
    t: 'verb',
    d: 'toeic',
    l: 'B2',
    ipa: 'əˈkɑːmədeɪt',
    vi: 'đáp ứng, chứa được (sức chứa)',
    expVi: 'Có đủ không gian cho một lượng người hoặc đáp ứng nhu cầu của ai đó',
    expEn: 'To provide with a place to live or to be stored in, or meet a need',
    exEn: 'The new banquet hall can *********** up to 500 guests.',
    exVi: 'Sảnh tiệc mới có thể chứa được tới 500 khách mời.',
  },
  {
    w: 'collaborate',
    t: 'verb',
    d: 'toeic',
    l: 'B2',
    ipa: 'kəˈlæbəreɪt',
    vi: 'hợp tác, cộng tác',
    expVi: 'Làm việc cùng nhau với người hoặc tổ chức khác để đạt mục tiêu chung',
    expEn: 'To work with someone else for a special purpose',
    exEn: 'Two tech giants decided to *********** on battery research.',
    exVi: 'Hai gã khổng lồ công nghệ đã quyết định hợp tác nghiên cứu pin.',
  },
  {
    w: 'procure',
    t: 'verb',
    d: 'toeic',
    l: 'C1',
    ipa: 'prəˈkjʊr',
    vi: 'thu mua, tìm kiếm cung ứng',
    expVi: 'Đạt được hoặc mua được nguồn vật tư, thiết bị cho doanh nghiệp',
    expEn: 'To get something, especially after an effort',
    exEn: 'The logistics department managed to ******* raw materials at a lower cost.',
    exVi: 'Bộ phận hậu cần đã thu mua được nguyên liệu thô với chi phí thấp hơn.',
  },
  {
    w: 'commute',
    t: 'verb',
    d: 'toeic',
    l: 'B1',
    ipa: 'kəˈmjuːt',
    vi: 'đi lại thường xuyên (giữa nhà và nơi làm việc)',
    expVi: 'Di chuyển hàng ngày từ nhà đến chỗ làm và ngược lại',
    expEn: 'To make the same journey regularly between work and home',
    exEn: 'Thousands of workers ******* from the suburbs to the city center daily.',
    exVi: 'Hàng ngàn công nhân đi làm hàng ngày từ vùng ngoại ô vào trung tâm thành phố.',
  },
  {
    w: 'agenda',
    t: 'noun',
    d: 'toeic',
    l: 'B1',
    ipa: 'əˈdʒendə',
    vi: 'chương trình nghị sự, nội dung cuộc họp',
    expVi: 'Danh sách các vấn đề cần được bàn bạc trong một cuộc họp',
    expEn: 'A list of matters to be discussed at a meeting',
    exEn: 'Budget allocation is the first item on today meeting ******.',
    exVi: 'Phân bổ ngân sách là mục đầu tiên trong nội dung cuộc họp hôm nay.',
  },
  {
    w: 'endorse',
    t: 'verb',
    d: 'toeic',
    l: 'B2',
    ipa: 'ɪnˈdɔːrs',
    vi: 'tán thành, ủng hộ, đại diện quảng bá',
    expVi: 'Công khai tuyên bố ủng hộ một kế hoạch, ứng viên hoặc sản phẩm',
    expEn: 'To make a public statement of your approval or support for something',
    exEn: 'Famous athletes often ******* sportswear brands.',
    exVi: 'Các vận động viên nổi tiếng thường đại diện quảng bá cho các thương hiệu đồ thể thao.',
  },
  {
    w: 'supervise',
    t: 'verb',
    d: 'toeic',
    l: 'B2',
    ipa: 'ˈsuːpərvaɪz',
    vi: 'giám sát, quản lý trực tiếp',
    expVi: 'Theo dõi một hoạt động hoặc nhóm người để đảm bảo mọi việc diễn ra đúng quy trình',
    expEn: 'To watch a person or activity to make certain that everything is done correctly',
    exEn: 'Her role is to ********* the onboarding of new interns.',
    exVi: 'Vai trò của cô ấy là giám sát quá trình hội nhập của các thực tập sinh mới.',
  },
  {
    w: 'terminate',
    t: 'verb',
    d: 'toeic',
    l: 'B2',
    ipa: 'ˈtɜːrmɪneɪt',
    vi: 'chấm dứt, kết thúc (hợp đồng, hiệu lực)',
    expVi: 'Làm cho một thỏa thuận hoặc hợp đồng kết thúc hoàn toàn',
    expEn: 'To end or cause something to end',
    exEn: 'Either party may ********* the lease with thirty days notice.',
    exVi: 'Một trong hai bên có thể chấm dứt hợp đồng thuê với thông báo trước 30 ngày.',
  },
  {
    w: 'implement',
    t: 'verb',
    d: 'toeic',
    l: 'B2',
    ipa: 'ˈɪmplɪment',
    vi: 'triển khai, thi hành, áp dụng',
    expVi: 'Đưa một kế hoạch, chính sách hoặc hệ thống vào hoạt động thực tế',
    expEn: 'To start using a plan or system',
    exEn: 'We will ********* the new security protocol next Monday.',
    exVi: 'Chúng tôi sẽ triển khai giao thức bảo mật mới vào thứ Hai tới.',
  },
  {
    w: 'revenue',
    t: 'noun',
    d: 'toeic',
    l: 'B2',
    ipa: 'ˈrevənjuː',
    vi: 'doanh thu, tổng thu nhập',
    expVi: 'Tổng số tiền mà doanh nghiệp thu được từ hoạt động bán hàng và dịch vụ',
    expEn: 'The income that a government or company receives regularly',
    exEn: 'Advertising ******* rose by twenty percent in the fourth quarter.',
    exVi: 'Doanh thu quảng cáo đã tăng 20% trong quý thứ tư.',
  },
  {
    w: 'adjacent',
    t: 'adjective',
    d: 'toeic',
    l: 'B2',
    ipa: 'əˈdʒeɪsnt',
    vi: 'liền kề, sát cạnh bên',
    expVi: 'Nằm ngay sát cạnh hoặc tiếp giáp với một tòa nhà hay căn phòng khác',
    expEn: 'Very near, next to, or touching',
    exEn: 'The parking lot is ******** to the main office building.',
    exVi: 'Bãi đậu xe nằm ngay sát cạnh tòa nhà văn phòng chính.',
  },

  // ==================== OXFORD 3000 (30 cards) ====================
  {
    w: 'accomplish',
    t: 'verb',
    d: 'oxford3000',
    l: 'B2',
    ipa: 'əˈkɑːmplɪʃ',
    vi: 'hoàn thành, đạt được thành tựu',
    expVi: 'Thực hiện thành công một mục tiêu hoặc nhiệm vụ sau khi nỗ lực',
    expEn: 'To finish something successfully or to achieve something',
    exEn: 'We can ********** much more if we work together as a team.',
    exVi: 'Chúng ta có thể đạt được nhiều hơn nữa nếu làm việc cùng nhau như một đội.',
  },
  {
    w: 'enthusiastic',
    t: 'adjective',
    d: 'oxford3000',
    l: 'B1',
    ipa: 'ɪnˌθuːziˈæstɪk',
    vi: 'nhiệt tình, hào hứng, say mê',
    expVi: 'Thể hiện sự hứng thú và nhiệt huyết lớn đối với một hoạt động',
    expEn: 'Showing enthusiasm; feeling energetic interest in a particular subject',
    exEn: 'The audience gave an ************ welcome to the band.',
    exVi: 'Khán giả đã dành sự chào đón đầy hào hứng cho ban nhạc.',
  },
  {
    w: 'perspective',
    t: 'noun',
    d: 'oxford3000',
    l: 'B2',
    ipa: 'pərˈspektɪv',
    vi: 'góc nhìn, quan điểm',
    expVi: 'Cách nhìn nhận và đánh giá một vấn đề từ một vị trí cụ thể',
    expEn: 'A particular way of considering something',
    exEn: 'Traveling abroad gives you a fresh *********** on life.',
    exVi: 'Đi du lịch nước ngoài mang lại cho bạn một góc nhìn mới mẻ về cuộc sống.',
  },
  {
    w: 'reluctant',
    t: 'adjective',
    d: 'oxford3000',
    l: 'B2',
    ipa: 'rɪˈlʌktənt',
    vi: 'miễn cưỡng, ngần ngại, bất đắc dĩ',
    expVi: 'Không sẵn lòng làm việc gì đó và vì thế chần chừ, do dự',
    expEn: 'Not willing to do something and therefore slow to do it',
    exEn: 'Many people are ********* to talk about their personal finances.',
    exVi: 'Nhiều người ngần ngại khi nói về tài chính cá nhân của họ.',
  },
  {
    w: 'consequence',
    t: 'noun',
    d: 'oxford3000',
    l: 'B1',
    ipa: 'ˈkɑːnsɪkwens',
    vi: 'hậu quả, hệ quả',
    expVi: 'Kết quả của một hành động hoặc tình huống, thường là kết quả không tốt',
    expEn: 'A result of a particular action or situation, often one that is bad',
    exEn: 'He must face the *********** of his reckless decision.',
    exVi: 'Anh ấy phải đối mặt với hậu quả từ quyết định liều lĩnh của mình.',
  },
  {
    w: 'elaborate',
    t: 'adjective',
    d: 'oxford3000',
    l: 'B2',
    ipa: 'ɪˈlæbərət',
    vi: 'công phu, tỉ mỉ, chi tiết',
    expVi: 'Có nhiều chi tiết phức tạp hoặc được chuẩn bị rất kỹ lưỡng',
    expEn: 'Containing a lot of careful detail or many detailed parts',
    exEn: 'They made ********* preparations for the royal wedding.',
    exVi: 'Họ đã thực hiện những bước chuẩn bị vô cùng công phu cho đám cưới hoàng gia.',
  },
  {
    w: 'obstacle',
    t: 'noun',
    d: 'oxford3000',
    l: 'B2',
    ipa: 'ˈɑːbstəkl',
    vi: 'chướng ngại vật, rào cản',
    expVi: 'Điều gây cản trở khiến việc đạt được mục tiêu trở nên khó khăn hơn',
    expEn: 'Something that blocks you so that movement or progress is prevented',
    exEn: 'Fear of failure is the biggest ******** to success.',
    exVi: 'Nỗi sợ thất bại là rào cản lớn nhất dẫn đến thành công.',
  },
  {
    w: 'significant',
    t: 'adjective',
    d: 'oxford3000',
    l: 'B2',
    ipa: 'sɪɡˈnɪfɪkənt',
    vi: 'đáng kể, quan trọng, có ý nghĩa lớn',
    expVi: 'Đủ lớn hoặc đủ quan trọng để tạo ra sự chú ý hoặc tác động rõ rệt',
    expEn: 'Important or noticeable',
    exEn: 'There has been a *********** increase in renewable energy usage.',
    exVi: 'Đã có một sự gia tăng đáng kể trong việc sử dụng năng lượng tái tạo.',
  },
  {
    w: 'temporary',
    t: 'adjective',
    d: 'oxford3000',
    l: 'B1',
    ipa: 'ˈtempəreri',
    vi: 'tạm thời, ngắn hạn',
    expVi: 'Chỉ kéo dài trong một khoảng thời gian giới hạn, không phải vĩnh viễn',
    expEn: 'Not lasting or needed for very long',
    exEn: 'Painkillers only provide ********* relief for toothache.',
    exVi: 'Thuốc giảm đau chỉ mang lại sự thuyên giảm tạm thời cho cơn đau răng.',
  },
  {
    w: 'determine',
    t: 'verb',
    d: 'oxford3000',
    l: 'B1',
    ipa: 'dɪˈtɜːrmɪn',
    vi: 'xác định, quyết định',
    expVi: 'Khám phá ra sự thật hoặc đóng vai trò là yếu tố quyết định kết quả',
    expEn: 'To control or influence something directly, or to decide what will happen',
    exEn: 'Investigators are trying to ********* the cause of the fire.',
    exVi: 'Các nhà điều tra đang cố gắng xác định nguyên nhân vụ cháy.',
  },
  {
    w: 'efficient',
    t: 'adjective',
    d: 'oxford3000',
    l: 'B1',
    ipa: 'ɪˈfɪʃnt',
    vi: 'hiệu quả, năng suất cao (ít tốn kém)',
    expVi: 'Hoạt động tốt và nhanh chóng mà không lãng phí thời gian hay năng lượng',
    expEn: 'Working or operating quickly and effectively in an organized way',
    exEn: 'LED bulbs are much more ********* than traditional lamps.',
    exVi: 'Bóng đèn LED tiết kiệm và hiệu quả hơn nhiều so với đèn truyền thống.',
  },
  {
    w: 'fascinating',
    t: 'adjective',
    d: 'oxford3000',
    l: 'B1',
    ipa: 'ˈfæsɪneɪtɪŋ',
    vi: 'hấp dẫn, lôi cuốn, thú vị',
    expVi: 'Cực kỳ thú vị và thu hút sự chú ý của người khác',
    expEn: 'Extremely interesting',
    exEn: 'The documentary about deep-sea creatures was ***********.',
    exVi: 'Bộ phim tài liệu về các sinh vật biển sâu vô cùng hấp dẫn.',
  },
  {
    w: 'genuine',
    t: 'adjective',
    d: 'oxford3000',
    l: 'B2',
    ipa: 'ˈdʒenjuɪn',
    vi: 'chân thành, thật (không giả mạo)',
    expVi: 'Là hàng thật đúng như mô tả, hoặc tình cảm chân thật',
    expEn: 'If something is genuine, it is real and exactly what it appears to be',
    exEn: 'She showed ******* concern for her colleague health.',
    exVi: 'Cô ấy thể hiện sự quan tâm chân thành đến sức khỏe của đồng nghiệp.',
  },
  {
    w: 'hesitate',
    t: 'verb',
    d: 'oxford3000',
    l: 'B1',
    ipa: 'ˈhezɪteɪt',
    vi: 'do dự, ngập ngừng, chần chừ',
    expVi: 'Tạm dừng trước khi làm hoặc nói điều gì đó vì không chắc chắn hoặc lo lắng',
    expEn: 'To pause before you do or say something, often because you are uncertain',
    exEn: 'Please do not ******** to contact us if you need assistance.',
    exVi: 'Xin đừng ngần ngại liên hệ với chúng tôi nếu bạn cần hỗ trợ.',
  },
  {
    w: 'magnificent',
    t: 'adjective',
    d: 'oxford3000',
    l: 'B2',
    ipa: 'mæɡˈnɪfɪsnt',
    vi: 'tráng lệ, nguy nga, tuyệt đẹp',
    expVi: 'Cực kỳ đẹp mắt, ấn tượng và đáng ngưỡng mộ',
    expEn: 'Very good, beautiful, or deserving to be admired',
    exEn: 'The view from the mountain summit was ***********.',
    exVi: 'Khung cảnh nhìn từ đỉnh núi thật tráng lệ.',
  },
  {
    w: 'persuade',
    t: 'verb',
    d: 'oxford3000',
    l: 'B1',
    ipa: 'pərˈsweɪd',
    vi: 'thuyết phục',
    expVi: 'Làm cho ai đó đồng ý làm việc gì bằng cách đưa ra lý lẽ thuyết phục',
    expEn: 'To make someone do or believe something by giving them a good reason',
    exEn: 'It was difficult to ******** him to change his mind.',
    exVi: 'Thật khó để thuyết phục anh ấy thay đổi ý định.',
  },
  {
    w: 'priority',
    t: 'noun',
    d: 'oxford3000',
    l: 'B2',
    ipa: 'praɪˈɔːrəti',
    vi: 'sự ưu tiên hàng đầu',
    expVi: 'Việc quan trọng nhất cần phải được giải quyết trước các việc khác',
    expEn: 'Something that is very important and must be dealt with before other things',
    exEn: 'Customer safety is always our top ********.',
    exVi: 'Sự an toàn của khách hàng luôn là ưu tiên hàng đầu của chúng tôi.',
  },
  {
    w: 'accurate',
    t: 'adjective',
    d: 'oxford3000',
    l: 'B1',
    ipa: 'ˈækjərət',
    vi: 'chính xác, chuẩn xác',
    expVi: 'Đúng hoàn toàn ở mọi chi tiết, không có sai sót',
    expEn: 'Correct, exact, and without any mistakes',
    exEn: 'The weather forecast was surprisingly ******** this week.',
    exVi: 'Dự báo thời tiết tuần này chính xác một cách đáng ngạc nhiên.',
  },
  {
    w: 'beneficial',
    t: 'adjective',
    d: 'oxford3000',
    l: 'B2',
    ipa: 'ˌbenɪˈfɪʃl',
    vi: 'có lợi, hữu ích',
    expVi: 'Mang lại kết quả tốt hoặc giúp cải thiện tình hình',
    expEn: 'Helpful, useful, or good',
    exEn: 'Regular exercise is highly ********** to cardiovascular health.',
    exVi: 'Tập thể dục thường xuyên rất có lợi cho sức khỏe tim mạch.',
  },
  {
    w: 'circumstance',
    t: 'noun',
    d: 'oxford3000',
    l: 'B2',
    ipa: 'ˈsɜːrkəmstæns',
    vi: 'hoàn cảnh, tình huống',
    expVi: 'Điều kiện hoặc sự việc xung quanh ảnh hưởng đến cách một việc diễn ra',
    expEn: 'A fact or event that makes a situation the way it is',
    exEn: 'Under no ************ should you share your password.',
    exVi: 'Trong bất kỳ hoàn cảnh nào bạn cũng không nên chia sẻ mật khẩu của mình.',
  },
  {
    w: 'contribute',
    t: 'verb',
    d: 'oxford3000',
    l: 'B2',
    ipa: 'kənˈtrɪbjuːt',
    vi: 'đóng góp, góp phần',
    expVi: 'Đưa tiền, sức lực hoặc ý tưởng để giúp đạt được điều gì đó chung',
    expEn: 'To give something, especially money or ideas, in order to help achieve something',
    exEn: 'Every team member is encouraged to ********** new ideas.',
    exVi: 'Mỗi thành viên trong nhóm đều được khuyến khích đóng góp ý tưởng mới.',
  },
  {
    w: 'demonstrate',
    t: 'verb',
    d: 'oxford3000',
    l: 'B2',
    ipa: 'ˈdemənstreɪt',
    vi: 'chứng minh, trình bày minh họa',
    expVi: 'Cho thấy rõ ràng điều gì đó là đúng hoặc hướng dẫn cách một thứ hoạt động',
    expEn: 'To show or make something clear',
    exEn: 'The instructor will *********** how to use the safety equipment.',
    exVi: 'Người hướng dẫn sẽ trình bày cách sử dụng thiết bị an toàn.',
  },

  // ==================== COMMUNICATION (25 cards) ====================
  {
    w: 'appreciate',
    t: 'verb',
    d: 'communication',
    l: 'B1',
    ipa: 'əˈpriːʃieɪt',
    vi: 'trân trọng, cảm kích, đánh giá cao',
    expVi: 'Nhận ra giá trị tốt đẹp của ai/việc gì và cảm thấy biết ơn',
    expEn: 'To recognize how good someone or something is and to value them',
    exEn: 'I really ********** all your help with moving my apartment.',
    exVi: 'Tôi thực sự cảm kích mọi sự giúp đỡ của bạn khi chuyển căn hộ.',
  },
  {
    w: 'exhausted',
    t: 'adjective',
    d: 'communication',
    l: 'B1',
    ipa: 'ɪɡˈzɔːstɪd',
    vi: 'kiệt sức, mệt nhoài',
    expVi: 'Cực kỳ mệt mỏi, không còn chút năng lượng nào',
    expEn: 'Extremely tired',
    exEn: 'After working a twelve-hour shift, she felt completely *********.',
    exVi: 'Sau khi làm ca 12 tiếng, cô ấy cảm thấy hoàn toàn kiệt sức.',
  },
  {
    w: 'hilarious',
    t: 'adjective',
    d: 'communication',
    l: 'B2',
    ipa: 'hɪˈleriəs',
    vi: 'cực kỳ hài hước, buồn cười',
    expVi: 'Vô cùng vui nhộn và làm mọi người bật cười sảng khoái',
    expEn: 'Extremely funny and causing a lot of laughter',
    exEn: 'His stand-up comedy routine was absolutely *********.',
    exVi: 'Tiết mục hài độc thoại của anh ấy thực sự cực kỳ hài hước.',
  },
  {
    w: 'recommend',
    t: 'verb',
    d: 'communication',
    l: 'A2',
    ipa: 'ˌrekəˈmend',
    vi: 'gợi ý, giới thiệu, khuyên dùng',
    expVi: 'Đề xuất một món ăn, địa điểm hoặc giải pháp tốt cho người khác thử',
    expEn: 'To suggest that someone or something would be good or suitable',
    exEn: 'Can you ********* a good seafood restaurant near the beach?',
    exVi: 'Bạn có thể giới thiệu một nhà hàng hải sản ngon gần bãi biển không?',
  },
  {
    w: 'convenient',
    t: 'adjective',
    d: 'communication',
    l: 'B1',
    ipa: 'kənˈviːniənt',
    vi: 'thuận tiện, tiện lợi',
    expVi: 'Phù hợp với thời gian, nhu cầu và không gây rắc rối',
    expEn: 'Suitable for your purposes and needs and causing the least difficulty',
    exEn: 'Living near the metro station is very **********.',
    exVi: 'Sống gần ga tàu điện ngầm rất thuận tiện.',
  },
  {
    w: 'disappointed',
    t: 'adjective',
    d: 'communication',
    l: 'B1',
    ipa: 'ˌdɪsəˈpɔɪntɪd',
    vi: 'thất vọng',
    expVi: 'Buồn vì điều gì đó không diễn ra tốt đẹp như kỳ vọng ban đầu',
    expEn: 'Unhappy because someone or something was not as good as you hoped',
    exEn: 'Fans were ************ when the concert was canceled.',
    exVi: 'Người hâm mộ đã rất thất vọng khi buổi hòa nhạc bị hủy.',
  },
  {
    w: 'embarrassed',
    t: 'adjective',
    d: 'communication',
    l: 'B1',
    ipa: 'ɪmˈbærəst',
    vi: 'ngượng ngùng, xấu hổ',
    expVi: 'Cảm thấy bối rối, đỏ mặt trước đám đông vì một sơ suất nhỏ',
    expEn: 'Feeling ashamed or shy',
    exEn: 'He felt *********** when he forgot the client name.',
    exVi: 'Anh ấy cảm thấy ngượng ngùng khi quên mất tên của khách hàng.',
  },
  {
    w: 'gorgeous',
    t: 'adjective',
    d: 'communication',
    l: 'B1',
    ipa: 'ˈɡɔːrdʒəs',
    vi: 'tuyệt đẹp, lộng lẫy',
    expVi: 'Rất đẹp hoặc vô cùng dễ chịu (về ngoại hình, thời tiết, trang phục)',
    expEn: 'Very beautiful or pleasant',
    exEn: 'You look absolutely ******** in that evening dress!',
    exVi: 'Bạn trông thật lộng lẫy trong chiếc váy dạ hội đó!',
  },
  {
    w: 'stubborn',
    t: 'adjective',
    d: 'communication',
    l: 'B2',
    ipa: 'ˈstʌbərn',
    vi: 'bướng bỉnh, cứng đầu',
    expVi: 'Quyết làm theo ý mình và từ chối lắng nghe lời khuyên của người khác',
    expEn: 'Determined to do what he or she wants and refuses to do anything else',
    exEn: 'He is too ******** to admit that he made a mistake.',
    exVi: 'Anh ấy quá cứng đầu để thừa nhận rằng mình đã phạm sai lầm.',
  },
  {
    w: 'grateful',
    t: 'adjective',
    d: 'communication',
    l: 'B1',
    ipa: 'ˈɡreɪtfl',
    vi: 'biết ơn',
    expVi: 'Cảm thấy hoặc bày tỏ lòng cảm kích vì sự tử tế của người khác',
    expEn: 'Showing or expressing thanks, especially to another person',
    exEn: 'We are deeply ******** for your generous support.',
    exVi: 'Chúng tôi vô cùng biết ơn sự hỗ trợ hào phóng của bạn.',
  },
  {
    w: 'compromise',
    t: 'verb',
    d: 'communication',
    l: 'B2',
    ipa: 'ˈkɑːmprəmaɪz',
    vi: 'thỏa hiệp, nhượng bộ lẫn nhau',
    expVi: 'Đạt được sự đồng thuận bằng cách mỗi bên chấp nhận nhường một bước',
    expEn: 'To reach an agreement in an argument in which the people reduce their demands',
    exEn: 'In any relationship, both partners need to learn how to **********.',
    exVi: 'Trong bất kỳ mối quan hệ nào, cả hai đều cần học cách thỏa hiệp.',
  },
  {
    w: 'interrupt',
    t: 'verb',
    d: 'communication',
    l: 'B1',
    ipa: 'ˌɪntəˈrʌpt',
    vi: 'ngắt lời, làm gián đoạn',
    expVi: 'Nói xen vào khi người khác đang nói hoặc làm gián đoạn một hoạt động',
    expEn: 'To stop a person from speaking for a short period by something you say or do',
    exEn: 'It is impolite to ********* someone while they are speaking.',
    exVi: 'Thật bất lịch sự khi ngắt lời ai đó lúc họ đang nói.',
  },
  {
    w: 'enthusiasm',
    t: 'noun',
    d: 'communication',
    l: 'B2',
    ipa: 'ɪnˈθuːziæzəm',
    vi: 'sự nhiệt huyết, lòng nhiệt tình',
    expVi: 'Cảm giác hào hứng mạnh mẽ và sẵn sàng tham gia vào việc gì',
    expEn: 'A feeling of energetic interest in a particular subject or activity',
    exEn: 'She approached her new job with great **********.',
    exVi: 'Cô ấy bắt đầu công việc mới với lòng nhiệt huyết lớn.',
  },
  {
    w: 'apologize',
    t: 'verb',
    d: 'communication',
    l: 'A2',
    ipa: 'əˈpɑːlədʒaɪz',
    vi: 'xin lỗi',
    expVi: 'Nói lời nhận lỗi với ai đó vì đã gây ra phiền phức hoặc sai sót',
    expEn: 'To tell someone that you are sorry for having done something that has caused problems',
    exEn: 'I would like to ********* for the late reply.',
    exVi: 'Tôi muốn xin lỗi vì đã phản hồi muộn.',
  },
  {
    w: 'schedule',
    t: 'noun',
    d: 'communication',
    l: 'A2',
    ipa: 'ˈskedʒuːl',
    vi: 'lịch trình, thời gian biểu',
    expVi: 'Danh sách các công việc hoặc sự kiện kèm theo thời gian dự kiến thực hiện',
    expEn: 'A list of planned activities or things to be done showing the times',
    exEn: 'Everything is going according to ********.',
    exVi: 'Mọi thứ đều đang diễn ra đúng theo lịch trình.',
  },

  // ==================== ADVANCED (20 cards) ====================
  {
    w: 'ephemeral',
    t: 'adjective',
    d: 'advanced',
    l: 'C2',
    ipa: 'ɪˈfemərəl',
    vi: 'phù du, chóng tàn, ngắn ngủi',
    expVi: 'Chỉ tồn tại hoặc kéo dài trong một khoảng thời gian cực kỳ ngắn ngủi',
    expEn: 'Lasting for only a short time',
    exEn: 'Internet fame is often *********, fading within a few weeks.',
    exVi: 'Sự nổi tiếng trên mạng thường rất chóng tàn, phai nhạt chỉ sau vài tuần.',
  },
  {
    w: 'meticulous',
    t: 'adjective',
    d: 'advanced',
    l: 'C1',
    ipa: 'məˈtɪkjələs',
    vi: 'tỉ mỉ, kỹ lưỡng từng chi tiết',
    expVi: 'Rất cẩn thận và chú ý chính xác đến từng chi tiết nhỏ nhất',
    expEn: 'Very careful and with great attention to every detail',
    exEn: 'The watchmaker is known for his ********** craftsmanship.',
    exVi: 'Người thợ đồng hồ nổi tiếng với tay nghề tỉ mỉ đến từng chi tiết.',
  },
  {
    w: 'eloquent',
    t: 'adjective',
    d: 'advanced',
    l: 'C1',
    ipa: 'ˈeləkwənt',
    vi: 'hùng hồn, có tài hùng biện',
    expVi: 'Diễn đạt ý tưởng một cách rõ ràng, truyền cảm và đầy sức thuyết phục',
    expEn: 'Giving a clear, strong message; fluent or persuasive in speaking or writing',
    exEn: 'She delivered an ******** speech that moved the entire audience.',
    exVi: 'Cô ấy đã có một bài phát biểu hùng hồn làm xúc động cả khán phòng.',
  },
  {
    w: 'serendipity',
    t: 'noun',
    d: 'advanced',
    l: 'C2',
    ipa: 'ˌserənˈdɪpəti',
    vi: 'cơ duyên tình cờ may mắn',
    expVi: 'Sự tình cờ tìm thấy những điều tốt đẹp hoặc thú vị khi không hề chủ đích tìm kiếm',
    expEn: 'The fact of finding interesting or valuable things by chance',
    exEn: 'Meeting my co-founder at the airport was pure ***********.',
    exVi: 'Gặp được người đồng sáng lập của tôi ở sân bay hoàn toàn là một cơ duyên tình cờ.',
  },
  {
    w: 'superfluous',
    t: 'adjective',
    d: 'advanced',
    l: 'C2',
    ipa: 'suːˈpɜːrfluəs',
    vi: 'thừa thãi, không cần thiết',
    expVi: 'Nhiều hơn mức cần thiết, dư thừa và có thể lược bỏ',
    expEn: 'More than is needed or wanted',
    exEn: 'A good editor removes all *********** words from the manuscript.',
    exVi: 'Một biên tập viên giỏi sẽ loại bỏ mọi từ ngữ thừa thãi khỏi bản thảo.',
  },
  {
    w: 'benevolent',
    t: 'adjective',
    d: 'advanced',
    l: 'C1',
    ipa: 'bəˈnevələnt',
    vi: 'nhân từ, rộng lượng, thiện tâm',
    expVi: 'Tốt bụng, giàu lòng nhân ái và luôn muốn giúp đỡ người khác',
    expEn: 'Kind and helpful',
    exEn: 'A ********** donor funded the entire scholarship program.',
    exVi: 'Một nhà hảo tâm nhân từ đã tài trợ toàn bộ chương trình học bổng.',
  },
  {
    w: 'quintessential',
    t: 'adjective',
    d: 'advanced',
    l: 'C2',
    ipa: 'ˌkwɪntɪˈsenʃl',
    vi: 'tinh túy nhất, điển hình nhất',
    expVi: 'Là đại diện hoàn hảo và tiêu biểu nhất cho một phẩm chất hoặc phong cách',
    expEn: 'Being the most typical example or most important part of something',
    exEn: 'Pho is considered the ************** Vietnamese dish.',
    exVi: 'Phở được xem là món ăn tinh túy và điển hình nhất của Việt Nam.',
  },
  {
    w: 'tenacious',
    t: 'adjective',
    d: 'advanced',
    l: 'C1',
    ipa: 'təˈneɪʃəs',
    vi: 'kiên trì, bền bỉ, không bỏ cuộc',
    expVi: 'Bám đuổi mục tiêu đến cùng với quyết tâm cao độ, không dễ dàng buông xuôi',
    expEn: 'Holding tightly onto something, or keeping an opinion in a determined way',
    exEn: 'Her ********* spirit helped her win the championship.',
    exVi: 'Tinh thần kiên trì bền bỉ đã giúp cô ấy giành chức vô địch.',
  },
  {
    w: 'audacious',
    t: 'adjective',
    d: 'advanced',
    l: 'C2',
    ipa: 'ɔːˈdeɪʃəs',
    vi: 'táo bạo, cả gan, dám nghĩ dám làm',
    expVi: 'Sẵn sàng chấp nhận rủi ro lớn một cách đầy tự tin và bất ngờ',
    expEn: 'Showing a willingness to take surprisingly bold risks',
    exEn: 'The startup announced an ********* plan to colonize Mars.',
    exVi: 'Công ty khởi nghiệp đã công bố một kế hoạch táo bạo nhằm định cư trên sao Hỏa.',
  },
  {
    w: 'vindicate',
    t: 'verb',
    d: 'advanced',
    l: 'C2',
    ipa: 'ˈvɪndɪkeɪt',
    vi: 'minh oan, chứng minh là đúng',
    expVi: 'Chứng minh rằng ai đó không có lỗi hoặc nhận định trước đó của họ là hoàn toàn đúng',
    expEn: 'To prove that what someone said or did was right or true, after other people thought it was wrong',
    exEn: 'New DNA evidence helped ********* the wrongly accused man.',
    exVi: 'Bằng chứng DNA mới đã giúp minh oan cho người đàn ông bị kết tội oan.',
  },
  {
    w: 'clandestine',
    t: 'adjective',
    d: 'advanced',
    l: 'C2',
    ipa: 'klænˈdestɪn',
    vi: 'bí mật, lén lút, ngầm',
    expVi: 'Được lên kế hoạch hoặc thực hiện một cách kín đáo để che giấu sự thật',
    expEn: 'Planned or done in secret, especially describing something that is not officially allowed',
    exEn: 'The spies held a *********** meeting in an underground cafe.',
    exVi: 'Các điệp viên đã tổ chức một cuộc gặp bí mật tại một quán cà phê ngầm.',
  },
  {
    w: 'pervasive',
    t: 'adjective',
    d: 'advanced',
    l: 'C2',
    ipa: 'pərˈveɪsɪv',
    vi: 'lan tỏa khắp nơi, thấm sâu',
    expVi: 'Hiện diện và ảnh hưởng mạnh mẽ ở khắp mọi ngóc ngách của xã hội',
    expEn: 'Present or noticeable in every part of a thing or place',
    exEn: 'The influence of social media is ********* among teenagers.',
    exVi: 'Sự ảnh hưởng của mạng xã hội đang lan tỏa khắp nơi trong giới trẻ.',
  },
];

export const BUILTIN_VOCAB_CARDS: VocabCard[] = RAW_SEEDS.map((s, idx) => ({
  cardId: `${s.d}-${idx + 1}-${s.w}`,
  word: s.w.toLowerCase(),
  type: s.t,
  deckId: s.d,
  level: s.l,
  phonetics: [
    {
      locale: 'en-US',
      text: s.ipa,
      audio: `https://api.dictionaryapi.dev/media/pronunciations/en/${s.w.toLowerCase()}-us.mp3`,
    },
  ],
  translation: {
    vi: s.vi,
    en: s.expEn,
  },
  explanation: {
    vi: s.expVi,
    en: s.expEn,
  },
  exampleMasked: {
    en: s.exEn,
    vi: s.exVi,
  },
}));

/**
 * Generates initial wordMask like Parroto: underscores for letters, keeping spaces/hyphens.
 */
export function createInitialMask(word: string): string {
  return word
    .split('')
    .map((ch) => (ch === ' ' || ch === '-' ? ch : '_'))
    .join('');
}

/**
 * Progressively reveals `count` unrevealed letters in the mask, leaving at least 1 hidden letter.
 */
export function revealNextLetters(word: string, currentMask: string, count = 1): string {
  const chars = word.split('');
  const maskChars = currentMask.split('');
  const hiddenIndices: number[] = [];

  for (let i = 0; i < chars.length; i++) {
    if (maskChars[i] === '_') {
      hiddenIndices.push(i);
    }
  }

  // Always keep at least 1 character hidden so the player still has to guess
  const maxRevealable = Math.max(0, hiddenIndices.length - 1);
  const toReveal = Math.min(count, maxRevealable);

  if (toReveal <= 0) return currentMask;

  // Prefer revealing the first letter first if still hidden, then random letters
  for (let r = 0; r < toReveal; r++) {
    if (hiddenIndices.includes(0)) {
      maskChars[0] = chars[0];
      hiddenIndices.splice(hiddenIndices.indexOf(0), 1);
    } else if (hiddenIndices.length > 1) {
      const randIdx = Math.floor(Math.random() * hiddenIndices.length);
      const pos = hiddenIndices[randIdx];
      maskChars[pos] = chars[pos];
      hiddenIndices.splice(randIdx, 1);
    }
  }

  return maskChars.join('');
}

const STATIC_DECK_IDS: Exclude<DeckId, 'all' | 'custom'>[] = [
  'common-1000',
  'conversation',
  'oxford-3000-a1',
  'oxford-3000-a2',
  'oxford-b1-b2',
  'oxford-c1-c2',
  'toeic-600',
  'ets-toeic',
  'ielts-600',
  'ielts-band-4-5',
  'ielts-advanced',
  'toefl-essential',
  'thpt-qg',
  'sat-c1-c2',
  'lunar-new-year',
];

const deckCache = new Map<string, VocabCard[]>();
const deckLoadingPromises = new Map<string, Promise<VocabCard[]>>();

async function fetchSingleDeckJson(deckId: string): Promise<VocabCard[]> {
  if (deckCache.has(deckId)) {
    return deckCache.get(deckId)!;
  }
  if (deckLoadingPromises.has(deckId)) {
    return deckLoadingPromises.get(deckId)!;
  }

  const promise = fetch(`/data/decks/${deckId}.json`)
    .then(async (res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as VocabCard[];
      if (Array.isArray(data) && data.length > 0) {
        deckCache.set(deckId, data);
        return data;
      }
      return [];
    })
    .catch((err) => {
      console.warn(`Failed to load deck ${deckId}:`, err);
      return [];
    })
    .finally(() => {
      deckLoadingPromises.delete(deckId);
    });

  deckLoadingPromises.set(deckId, promise);
  return promise;
}

export function preloadDeck(deckId: DeckId): void {
  if (typeof window === 'undefined') return;
  if (deckId === 'custom') return;
  if (deckId === 'all') {
    // Preload a diverse mix of decks in the background
    const shuffledDecks = [...STATIC_DECK_IDS].sort(() => Math.random() - 0.5);
    shuffledDecks.slice(0, 5).forEach((id) => {
      void fetchSingleDeckJson(id);
    });
    return;
  }
  void fetchSingleDeckJson(deckId);
}

export async function loadDeckCards(
  deckId: DeckId,
  customCards: VocabCard[] = []
): Promise<VocabCard[]> {
  if (deckId === 'custom') {
    return customCards.length > 0 ? [...customCards] : [...BUILTIN_VOCAB_CARDS];
  }

  if (deckId === 'all') {
    // Pick 5 random decks across levels (plus any already cached decks) so 'all' has thousands of words
    const shuffledDecks = [...STATIC_DECK_IDS].sort(() => Math.random() - 0.5);
    const targetDecks = shuffledDecks.slice(0, 5);
    await Promise.all(targetDecks.map((id) => fetchSingleDeckJson(id)));

    const combined: VocabCard[] = [];
    for (const [, cards] of deckCache.entries()) {
      combined.push(...cards);
    }
    if (customCards.length > 0) {
      combined.push(...customCards);
    }
    return combined.length > 0 ? combined : [...BUILTIN_VOCAB_CARDS];
  }

  const loaded = await fetchSingleDeckJson(deckId);
  return loaded.length > 0 ? loaded : [...BUILTIN_VOCAB_CARDS];
}

export function getDeckCardCount(
  deckId: DeckId,
  customCards: VocabCard[] = []
): number {
  if (deckId === 'custom') return customCards.length;
  if (deckId === 'all') return TOTAL_PARROTO_CARDS + customCards.length;
  const cached = deckCache.get(deckId);
  if (cached && cached.length > 0) return cached.length;
  const meta = DECK_LIST.find((d) => d.id === deckId);
  return meta?.cardCount || BUILTIN_VOCAB_CARDS.length;
}

function shuffleAndPick(pool: VocabCard[], count: number): VocabCard[] {
  const safePool = pool.length > 0 ? pool : BUILTIN_VOCAB_CARDS;
  const shuffled = [...safePool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const result: VocabCard[] = [];
  while (result.length < count) {
    for (const item of shuffled) {
      if (result.length < count) {
        result.push(item);
      }
    }
  }
  return result;
}

export async function pickBattleCardsAsync(
  deckId: DeckId,
  count: number,
  customCards: VocabCard[] = []
): Promise<VocabCard[]> {
  const pool = await loadDeckCards(deckId, customCards);
  return shuffleAndPick(pool, count);
}

/**
 * Synchronous fallback card selector (uses cached decks + built-in seed words).
 */
export function pickBattleCards(
  deckId: DeckId,
  count: number,
  customCards: VocabCard[] = []
): VocabCard[] {
  let pool: VocabCard[] = [];
  if (deckId === 'custom') {
    pool = customCards.length > 0 ? [...customCards] : [...BUILTIN_VOCAB_CARDS];
  } else if (deckId === 'all') {
    for (const [, cards] of deckCache.entries()) {
      pool.push(...cards);
    }
    pool.push(...BUILTIN_VOCAB_CARDS, ...customCards);
  } else {
    pool = deckCache.get(deckId) || BUILTIN_VOCAB_CARDS;
  }

  return shuffleAndPick(pool, count);
}

/**
 * Parses user-provided custom lines into VocabCard objects.
 * Format per line:
 * word | nghĩa tiếng Việt | giải thích (tuỳ chọn) | câu ví dụ tiếng Anh (tuỳ chọn)
 */
export function parseCustomVocabulary(rawText: string): VocabCard[] {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('#'));

  const cards: VocabCard[] = [];

  lines.forEach((line, idx) => {
    const parts = line
      .split(/\||;|\t|-/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (parts.length >= 2) {
      const word = parts[0].toLowerCase();
      const viMeaning = parts[1];
      const explanation = parts[2] || `Từ vựng tuỳ chỉnh: ${viMeaning}`;
      const rawExample =
        parts[3] || `Can you use the word "${word}" in a sentence?`;
      const maskedExample = rawExample.replace(
        new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
        '*'.repeat(word.length)
      );

      cards.push({
        cardId: `custom-${idx + 1}-${word}`,
        word,
        type: 'noun',
        deckId: 'custom',
        level: 'B2',
        phonetics: [
          {
            locale: 'en-US',
            text: word,
            audio: `https://api.dictionaryapi.dev/media/pronunciations/en/${encodeURIComponent(word)}-us.mp3`,
          },
        ],
        translation: {
          vi: viMeaning,
          en: explanation,
        },
        explanation: {
          vi: explanation,
          en: explanation,
        },
        exampleMasked: {
          en: maskedExample.includes('*')
            ? maskedExample
            : `Example with ${'*'.repeat(word.length)}: ${rawExample}`,
          vi: '',
        },
      });
    }
  });

  return cards;
}
