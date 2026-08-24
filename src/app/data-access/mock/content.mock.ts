import { Article, ArticleAuthor, ArticleCategory, FaqItem, Review } from '@core/models';

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  { id: 'ac-protection', slug: 'crop-protection', nameAr: 'وقاية النبات', nameEn: 'Crop protection' },
  { id: 'ac-nutrition', slug: 'nutrition', nameAr: 'تغذية المحاصيل', nameEn: 'Crop nutrition' },
  { id: 'ac-water', slug: 'water-soil', nameAr: 'التربة والمياه', nameEn: 'Soil and water' },
  { id: 'ac-practice', slug: 'field-practice', nameAr: 'ممارسات حقلية', nameEn: 'Field practice' },
];

export const AUTHORS: ArticleAuthor[] = [
  { id: 'au-sara', nameAr: 'م. سارة عبد الرحمن', nameEn: 'Eng. Sara Abdelrahman', titleAr: 'مهندسة وقاية نبات', titleEn: 'Plant protection engineer', avatar: '/assets/images/authors/sara.svg' },
  { id: 'au-omar', nameAr: 'م. عمر فتحي', nameEn: 'Eng. Omar Fathy', titleAr: 'أخصائي تغذية محاصيل', titleEn: 'Crop nutrition specialist', avatar: '/assets/images/authors/omar.svg' },
  { id: 'au-laila', nameAr: 'د. ليلى منصور', nameEn: 'Dr. Laila Mansour', titleAr: 'باحثة أمراض نبات', titleEn: 'Plant pathology researcher', avatar: '/assets/images/authors/laila.svg' },
];

function section(headingAr: string, headingEn: string, bodyAr: string, bodyEn: string) {
  return { headingAr, headingEn, bodyAr, bodyEn };
}

const ARTICLE_ROWS = [
  {
    id: 'art-wheat-rust', slug: 'wheat-rust-season', titleAr: 'كيف تقرأ نشرة أصداء القمح قبل الرش؟', titleEn: 'How to read a wheat rust bulletin before spraying',
    excerptAr: 'الأصداء مرض فطري يتأثر بالطقس. المقال يوضح الفرق بين الملاحظة الحقلية والقرار الكيميائي.', excerptEn: 'Rust is weather-driven. This article separates field observation from chemical decisions.',
    coverImage: '/assets/images/academy/wheat-rust.webp', categoryId: 'ac-protection', authorId: 'au-laila', publishedAt: '2026-01-12T08:00:00.000Z', updatedAt: '2026-02-02T08:00:00.000Z', readingMinutes: 7, views: 1840, featured: true, status: 'published',
    cropIds: ['crop-wheat'], problemIds: ['pr-rust'], relatedProductIds: ['p23', 'p03'], relatedArticleIds: ['art-nitrogen-timing', 'art-spray-coverage'], relatedCategoryIds: ['cat-fungicides'],
    seoTitleAr: 'أصداء القمح: قراءة النشرة قبل الرش', seoTitleEn: 'Wheat rust: reading the bulletin before spraying',
    seoDescriptionAr: 'دليل تعليمي لتوقيت الرش الوقائي لأصداء القمح في مصر.', seoDescriptionEn: 'An educational guide to preventive wheat rust spray timing in Egypt.',
    sections: [
      section('لماذا التوقيت أهم من المنتج؟', 'Why timing beats product choice', 'البثور تظهر بعد توفر رطوبة وحرارة مناسبة. الرش المتأخر بعد تغطية الأوراق بالكامل أقل كفاءة.', 'Pustules appear after suitable moisture and temperature. Late spraying after full canopy infection is less efficient.'),
      section('ماذا تراقب في الحقل؟', 'What to watch in the field', 'افحص السطح السفلي للأوراق في أكثر من موقع بالحقل، خاصة في الأصناف الحساسة.', 'Inspect the underside of leaves in several field spots, especially on sensitive varieties.'),
      section('تنويه السلامة', 'Safety note', 'يجب الالتزام بملصق المنتج وتعليمات وزارة الزراعة واستشارة مهندس زراعي عند الحاجة. هذا المقال تعليمي وليس توصية مبيد محددة.', 'Follow the product label, Ministry of Agriculture guidance, and consult an agronomist. This article is educational, not a specific pesticide recommendation.'),
    ],
  },
  {
    id: 'art-potato-blight', slug: 'potato-late-blight', titleAr: 'الندوة المتأخرة على البطاطس: رطوبة، تهوية، وبرنامج وقائي', titleEn: 'Potato late blight: humidity, airflow, and prevention',
    excerptAr: 'الندوة المتأخرة تنتشر بسرعة في العروات الباردة الرطبة. الوقاية أوفر من العلاج.', excerptEn: 'Late blight spreads quickly in cool humid cycles. Prevention is cheaper than rescue.',
    coverImage: '/assets/images/academy/potato-blight.webp', categoryId: 'ac-protection', authorId: 'au-laila', publishedAt: '2025-12-03T08:00:00.000Z', updatedAt: '2026-01-09T08:00:00.000Z', readingMinutes: 8, views: 2210, featured: true, status: 'published',
    cropIds: ['crop-potato'], problemIds: ['pr-blight'], relatedProductIds: ['p03', 'p04'], relatedArticleIds: ['art-greenhouse-humidity', 'art-spray-coverage'], relatedCategoryIds: ['cat-fungicides'],
    seoTitleAr: 'الندوة المتأخرة في البطاطس', seoTitleEn: 'Late blight in potato', seoDescriptionAr: 'شرح تعليمي لظروف الندوة المتأخرة دون تشخيص مضمون.', seoDescriptionEn: 'Educational explanation of late blight conditions without guaranteed diagnosis.',
    sections: [
      section('الظروف المحفزة', 'Favorable conditions', 'الندى الطويل والزراعة الكثيفة يرفعان احتمال الإصابة.', 'Long dew periods and dense planting raise infection risk.'),
      section('دور الصرف والري', 'Drainage and irrigation', 'الري بالرش في المساء يطيل فترة ابتلال الورقة.', 'Evening overhead irrigation lengthens leaf wetness.'),
      section('تنويه', 'Disclaimer', 'يجب الالتزام بملصق المنتج وتعليمات وزارة الزراعة واستشارة مهندس زراعي عند الحاجة.', 'Follow the product label and official guidance; consult an agronomist when needed.'),
    ],
  },
  {
    id: 'art-tomato-whitefly', slug: 'tomato-whitefly', titleAr: 'الذبابة البيضاء على الطماطم: إدارة وليس رشًا يوميًا', titleEn: 'Whitefly on tomato: management, not daily spraying',
    excerptAr: 'تكرار الرش دون تناوب يسرّع المقاومة وينقل الفيروسات بشكل أسوأ أحيانًا.', excerptEn: 'Repeated spraying without rotation speeds resistance and can worsen virus spread.',
    coverImage: '/assets/images/academy/whitefly.webp', categoryId: 'ac-protection', authorId: 'au-sara', publishedAt: '2026-03-18T08:00:00.000Z', updatedAt: '2026-03-18T08:00:00.000Z', readingMinutes: 6, views: 1650, featured: false, status: 'published',
    cropIds: ['crop-tomato', 'crop-cucumber'], problemIds: ['pr-whitefly'], relatedProductIds: ['p01', 'p02'], relatedArticleIds: ['art-virus-vectors', 'art-spray-coverage'], relatedCategoryIds: ['cat-insecticides'],
    seoTitleAr: 'إدارة الذبابة البيضاء على الطماطم', seoTitleEn: 'Managing whitefly on tomato', seoDescriptionAr: 'مبادئ الإدارة المتكاملة للذبابة البيضاء.', seoDescriptionEn: 'IPM principles for whitefly.',
    sections: [
      section('الشبك والأبواب', 'Screens and doors', 'في الصوب، إحكام المداخل يخفض الدخول أكثر من أي مبيد.', 'In greenhouses, sealing entries reduces influx more than any insecticide.'),
      section('العتبة الاقتصادية', 'Thresholds', 'وجود أفراد قليلة لا يعني دائمًا الرش الفوري.', 'A few individuals do not always justify immediate spraying.'),
      section('تنويه', 'Disclaimer', 'يجب الالتزام بملصق المنتج وتعليمات وزارة الزراعة واستشارة مهندس زراعي عند الحاجة.', 'Follow the label and official guidance.'),
    ],
  },
  {
    id: 'art-root-health', slug: 'root-health-basics', titleAr: 'صحة الجذور: نيماتودا، أعفان، وسوء صرف', titleEn: 'Root health: nematodes, rot, and poor drainage',
    excerptAr: 'اصفرار المجموع الخضري يبدأ غالبًا تحت الأرض. افحص الجذور قبل اختيار المغذي.', excerptEn: 'Canopy yellowing often starts underground. Inspect roots before choosing a nutrient.',
    coverImage: '/assets/images/academy/roots.webp', categoryId: 'ac-water', authorId: 'au-omar', publishedAt: '2026-02-21T08:00:00.000Z', updatedAt: '2026-04-01T08:00:00.000Z', readingMinutes: 9, views: 1988, featured: true, status: 'published',
    cropIds: ['crop-potato', 'crop-tomato', 'crop-strawberry'], problemIds: ['pr-nematode', 'pr-rot', 'pr-wilt'], relatedProductIds: ['p06', 'p20', 'p25'], relatedArticleIds: ['art-salinity-water', 'art-potato-blight'], relatedCategoryIds: ['cat-nematicides'],
    seoTitleAr: 'صحة الجذور في المحاصيل المصرية', seoTitleEn: 'Root health in Egyptian crops', seoDescriptionAr: 'الفرق بين أعراض النيماتودا وأعفان الجذور وسوء الري.', seoDescriptionEn: 'Separating nematode, root-rot, and irrigation symptoms.',
    sections: [
      section('العقد الجذرية', 'Root galls', 'وجود عقد لا يؤكد النوع دون فحص مختبر، لكنه مؤشر قوي.', 'Galls do not confirm species without a lab, but they are a strong clue.'),
      section('الري الزائد', 'Over-irrigation', 'التربة الغدقة تخنق الجذور وتفتح باب الأعفان.', 'Waterlogged soil suffocates roots and invites rot.'),
      section('تنويه', 'Disclaimer', 'هذا المحتوى إرشادي عام وليس تشخيصًا.', 'This content is general guidance, not a diagnosis.'),
    ],
  },
  {
    id: 'art-fruit-set', slug: 'fruit-set-heat', titleAr: 'ضعف العقد في الطماطم: حرارة أم تغذية أم ري؟', titleEn: 'Poor tomato fruit set: heat, nutrition, or water?',
    excerptAr: 'منظمات النمو لا تعوّض موجة حرارية فوق قدرة الأزهار.', excerptEn: 'Growth regulators do not offset a heat wave beyond flower tolerance.',
    coverImage: '/assets/images/academy/fruit-set.webp', categoryId: 'ac-nutrition', authorId: 'au-omar', publishedAt: '2026-04-11T08:00:00.000Z', updatedAt: '2026-04-11T08:00:00.000Z', readingMinutes: 6, views: 1420, featured: false, status: 'published',
    cropIds: ['crop-tomato', 'crop-mango'], problemIds: ['pr-set'], relatedProductIds: ['p13', 'p21', 'p12'], relatedArticleIds: ['art-mango-bloom', 'art-fruit-sizing'], relatedCategoryIds: ['cat-growth'],
    seoTitleAr: 'أسباب ضعف العقد في الطماطم', seoTitleEn: 'Causes of poor tomato fruit set', seoDescriptionAr: 'حرارة، تلقيح، كالسيوم، وري.', seoDescriptionEn: 'Heat, pollination, calcium, and irrigation.',
    sections: [
      section('نافذة الحرارة', 'Heat window', 'ارتفاع حرارة النهار مع ليل دافئ يسقط الأزهار.', 'High day temperature with a warm night drops flowers.'),
      section('دور الكالسيوم', 'Calcium role', 'اضطراب الكالسيوم يظهر لاحقًا على الثمار أكثر من سقوط الزهرة وحده.', 'Calcium disorders show later on fruit more than as flower drop alone.'),
      section('تنويه', 'Disclaimer', 'استشر مهندسًا زراعيًا قبل استخدام منظمات النمو.', 'Consult an agronomist before using growth regulators.'),
    ],
  },
  {
    id: 'art-micronutrients', slug: 'micronutrients-citrus', titleAr: 'الزنك والحديد في الموالح: اقرأ موقع الاصفرار', titleEn: 'Zinc and iron in citrus: read where yellowing starts',
    excerptAr: 'اصفرار الأوراق الحديثة يختلف عن القديمة، والخلط العشوائي للعناصر يهدر المال.', excerptEn: 'New-leaf yellowing differs from old-leaf yellowing; random mixes waste money.',
    coverImage: '/assets/images/academy/citrus-micro.webp', categoryId: 'ac-nutrition', authorId: 'au-omar', publishedAt: '2026-01-28T08:00:00.000Z', updatedAt: '2026-01-28T08:00:00.000Z', readingMinutes: 7, views: 1765, featured: false, status: 'published',
    cropIds: ['crop-citrus'], problemIds: ['pr-yellow'], relatedProductIds: ['p10', 'p27', 'p11'], relatedArticleIds: ['art-nitrogen-timing', 'art-citrus-mites'], relatedCategoryIds: ['cat-nutrients'],
    seoTitleAr: 'نقص الزنك والحديد في الموالح', seoTitleEn: 'Zinc and iron deficiency in citrus', seoDescriptionAr: 'كيف تميز موقع الاصفرار قبل اختيار المغذي.', seoDescriptionEn: 'How to distinguish yellowing position before choosing a nutrient.',
    sections: [
      section('الأوراق الحديثة', 'New leaves', 'نقص الحديد والزنك يظهر غالبًا على النمو الحديث.', 'Iron and zinc shortages often show on new growth.'),
      section('تحليل الورقة', 'Leaf analysis', 'التحليل أوضح من العين في البساتين المختلطة الأعراض.', 'Lab analysis is clearer than the eye in mixed-symptom groves.'),
      section('تنويه', 'Disclaimer', 'المحتوى تعليمي ولا يغني عن تحليل التربة أو الورقة.', 'Educational content does not replace soil or leaf tests.'),
    ],
  },
  {
    id: 'art-salinity-water', slug: 'irrigation-salinity', titleAr: 'ملوحة مياه الري: قِس ثم عالج', titleEn: 'Irrigation salinity: measure, then treat',
    excerptAr: 'معالجات الملوحة مساعدة. الغسيل ومصدر المياه هما الأساس.', excerptEn: 'Salinity products are supportive. Leaching and water source come first.',
    coverImage: '/assets/images/academy/salinity.webp', categoryId: 'ac-water', authorId: 'au-omar', publishedAt: '2026-05-05T08:00:00.000Z', updatedAt: '2026-05-05T08:00:00.000Z', readingMinutes: 8, views: 1330, featured: true, status: 'published',
    cropIds: ['crop-potato', 'crop-strawberry'], problemIds: ['pr-salinity'], relatedProductIds: ['p15', 'p16', 'p30'], relatedArticleIds: ['art-root-health'], relatedCategoryIds: ['cat-salinity'],
    seoTitleAr: 'إدارة ملوحة مياه الري', seoTitleEn: 'Managing irrigation-water salinity', seoDescriptionAr: 'قياس EC والغسيل والمعالجات المساعدة.', seoDescriptionEn: 'EC measurement, leaching, and supportive treatments.',
    sections: [
      section('لماذا القياس أولاً؟', 'Why measure first', 'بدون رقم EC تتحول المعاملة إلى تخمين.', 'Without an EC number, treatment is guesswork.'),
      section('الغسيل', 'Leaching', 'إضافة ماء إضافي بحدود الصرف المتاح تخفض تراكم الأملاح.', 'Extra water within drainage limits reduces salt buildup.'),
      section('تنويه', 'Disclaimer', 'ليست كل الأراضي تتحمل الغسيل الثقيل.', 'Not all soils tolerate heavy leaching.'),
    ],
  },
  {
    id: 'art-citrus-mites', slug: 'citrus-mites', titleAr: 'العنكبوت الأحمر على الموالح في الحر', titleEn: 'Citrus red spider mite in hot weather',
    excerptAr: 'الحلم يحب الجو الحار الجاف. الرش العشوائي بالمبيدات الحشرية قد يقتل الأعداء الحيوية.', excerptEn: 'Mites favor hot dry weather. Random insecticides may kill beneficials.',
    coverImage: '/assets/images/academy/mites.webp', categoryId: 'ac-protection', authorId: 'au-sara', publishedAt: '2026-06-14T08:00:00.000Z', updatedAt: '2026-06-14T08:00:00.000Z', readingMinutes: 5, views: 990, featured: false, status: 'published',
    cropIds: ['crop-citrus', 'crop-mango'], problemIds: ['pr-mite'], relatedProductIds: ['p07', 'p22', 'p26'], relatedArticleIds: ['art-strawberry-mites'], relatedCategoryIds: ['cat-acaricides'],
    seoTitleAr: 'إدارة الحلم على الموالح', seoTitleEn: 'Managing mites on citrus', seoDescriptionAr: 'مراقبة الحلم وتناوب الأكاسيد.', seoDescriptionEn: 'Mite scouting and acaricide rotation.',
    sections: [
      section('المراقبة', 'Scouting', 'افحص 20 ورقة من ارتفاعات مختلفة قبل القرار.', 'Inspect 20 leaves at different heights before deciding.'),
      section('التناوب', 'Rotation', 'لا تكرر مجموعة أكاروسية واحدة طوال الموسم.', 'Do not repeat one acaricide group all season.'),
      section('تنويه', 'Disclaimer', 'اتبع الملصق واستشر مختصًا.', 'Follow the label and consult a specialist.'),
    ],
  },
  {
    id: 'art-onion-thrips', slug: 'onion-thrips', titleAr: 'التربس في البصل: التغطية أهم من قوة المركب', titleEn: 'Onion thrips: coverage matters more than product strength',
    excerptAr: 'التربس يختبئ بين الأوراق. الرش السريع من أعلى لا يصل إلى موضعه.', excerptEn: 'Thrips hide between leaves. A quick overhead pass does not reach them.',
    coverImage: '/assets/images/academy/thrips.webp', categoryId: 'ac-protection', authorId: 'au-sara', publishedAt: '2026-02-08T08:00:00.000Z', updatedAt: '2026-02-08T08:00:00.000Z', readingMinutes: 5, views: 870, featured: false, status: 'published',
    cropIds: ['crop-onion', 'crop-pepper'], problemIds: ['pr-thrips'], relatedProductIds: ['p18', 'p01'], relatedArticleIds: ['art-spray-coverage'], relatedCategoryIds: ['cat-insecticides'],
    seoTitleAr: 'مكافحة تربس البصل', seoTitleEn: 'Onion thrips control', seoDescriptionAr: 'أهمية تغطية الرش ومواعيد الفجر.', seoDescriptionEn: 'Spray coverage and dawn timing.',
    sections: [
      section('موعد الرش', 'Spray time', 'الفجر أو آخر النهار أفضل من الظهيرة.', 'Dawn or late day beats midday.'),
      section('تنويه', 'Disclaimer', 'المحتوى تعليمي.', 'Educational content.'),
    ],
  },
  {
    id: 'art-grape-mildew', slug: 'grape-powdery-mildew', titleAr: 'البياض الدقيقي في العنب: قبل الإزهار وبعده', titleEn: 'Grape powdery mildew: before and after bloom',
    excerptAr: 'البرنامج الوقائي حول الإزهار يحمي العناقيد أكثر من الرش بعد تغطية الثمار.', excerptEn: 'A preventive program around bloom protects clusters better than late rescue sprays.',
    coverImage: '/assets/images/academy/grape-mildew.webp', categoryId: 'ac-protection', authorId: 'au-laila', publishedAt: '2026-03-02T08:00:00.000Z', updatedAt: '2026-03-02T08:00:00.000Z', readingMinutes: 6, views: 1120, featured: false, status: 'published',
    cropIds: ['crop-grapes'], problemIds: ['pr-mildew'], relatedProductIds: ['p04', 'p03'], relatedArticleIds: ['art-mango-bloom', 'art-spray-coverage'], relatedCategoryIds: ['cat-fungicides'],
    seoTitleAr: 'البياض الدقيقي على العنب', seoTitleEn: 'Powdery mildew on grapes', seoDescriptionAr: 'توقيت الرش حول إزهار العنب.', seoDescriptionEn: 'Spray timing around grape bloom.',
    sections: [
      section('لماذا الإزهار حرج؟', 'Why bloom is critical', 'إصابة العنقود المبكرة يصعب تعويضها.', 'Early cluster infection is hard to reverse.'),
      section('تنويه', 'Disclaimer', 'اتبع الملصق والتعليمات الرسمية.', 'Follow the label and official instructions.'),
    ],
  },
  {
    id: 'art-mango-bloom', slug: 'mango-bloom-care', titleAr: 'إزهار المانجو: بياض، تغذية، وحرارة', titleEn: 'Mango bloom: mildew, nutrition, and heat',
    excerptAr: 'حماية الشمراخ الزهري ليست منتجًا واحدًا بل جدولًا قصيرًا ودقيقًا.', excerptEn: 'Protecting the panicle is a short, precise schedule, not a single product.',
    coverImage: '/assets/images/academy/mango.webp', categoryId: 'ac-practice', authorId: 'au-sara', publishedAt: '2026-02-25T08:00:00.000Z', updatedAt: '2026-02-25T08:00:00.000Z', readingMinutes: 6, views: 1540, featured: false, status: 'published',
    cropIds: ['crop-mango'], problemIds: ['pr-mildew', 'pr-set'], relatedProductIds: ['p04', 'p28', 'p13'], relatedArticleIds: ['art-fruit-set', 'art-grape-mildew'], relatedCategoryIds: ['cat-fungicides', 'cat-growth'],
    seoTitleAr: 'رعاية إزهار المانجو', seoTitleEn: 'Mango bloom care', seoDescriptionAr: 'البياض والتغذية أثناء إزهار المانجو.', seoDescriptionEn: 'Mildew and nutrition during mango bloom.',
    sections: [
      section('الشماريخ', 'Panicles', 'أي إصابة مبكرة على الشمراخ تخفض العقد.', 'Early panicle infection reduces set.'),
      section('تنويه', 'Disclaimer', 'ليست توصية بمنظم نمو محدد.', 'Not a recommendation of a specific regulator.'),
    ],
  },
  {
    id: 'art-strawberry-mites', slug: 'strawberry-mites', titleAr: 'العنكبوت الأحمر في الفراولة تحت الأنفاق', titleEn: 'Spider mites in strawberry under tunnels',
    excerptAr: 'الأنفاق ترفع الحرارة وتسرّع الحلم. المراقبة الأسبوعية أوفر من الرش المفاجئ.', excerptEn: 'Tunnels raise heat and speed mites. Weekly scouting beats emergency spraying.',
    coverImage: '/assets/images/academy/strawberry.webp', categoryId: 'ac-protection', authorId: 'au-sara', publishedAt: '2025-11-20T08:00:00.000Z', updatedAt: '2026-01-05T08:00:00.000Z', readingMinutes: 5, views: 760, featured: false, status: 'published',
    cropIds: ['crop-strawberry'], problemIds: ['pr-mite'], relatedProductIds: ['p07', 'p26'], relatedArticleIds: ['art-citrus-mites', 'art-grey-mold'], relatedCategoryIds: ['cat-acaricides'],
    seoTitleAr: 'حلم الفراولة تحت الأنفاق', seoTitleEn: 'Strawberry mites under tunnels', seoDescriptionAr: 'مراقبة الحلم في الفراولة المحمية.', seoDescriptionEn: 'Mite scouting in protected strawberry.',
    sections: [
      section('افتح النفق', 'Vent the tunnel', 'التهوية تخفض الحرارة التي يحبها الحلم.', 'Ventilation lowers the heat mites favor.'),
      section('تنويه', 'Disclaimer', 'اتبع الملصق.', 'Follow the label.'),
    ],
  },
  {
    id: 'art-grey-mold', slug: 'strawberry-grey-mold', titleAr: 'العفن الرمادي على الفراولة: رطوبة الثمار', titleEn: 'Grey mold on strawberry: fruit wetness',
    excerptAr: 'قطرة الندى على الثمرة أخطر من نقص المبيد في كثير من الحقول.', excerptEn: 'A dew drop on fruit is often more dangerous than a missing fungicide.',
    coverImage: '/assets/images/academy/grey-mold.webp', categoryId: 'ac-protection', authorId: 'au-laila', publishedAt: '2026-01-16T08:00:00.000Z', updatedAt: '2026-01-16T08:00:00.000Z', readingMinutes: 5, views: 640, featured: false, status: 'published',
    cropIds: ['crop-strawberry', 'crop-grapes'], problemIds: ['pr-rot'], relatedProductIds: ['p19'], relatedArticleIds: ['art-strawberry-mites', 'art-greenhouse-humidity'], relatedCategoryIds: ['cat-fungicides'],
    seoTitleAr: 'العفن الرمادي في الفراولة', seoTitleEn: 'Grey mold in strawberry', seoDescriptionAr: 'الرطوبة والتهوية وجمع الثمار المصابة.', seoDescriptionEn: 'Humidity, ventilation, and removing infected fruit.',
    sections: [
      section('جمع الثمار', 'Fruit removal', 'إبقاء الثمار المصابة ينشر الجراثيم.', 'Leaving infected fruit spreads spores.'),
      section('تنويه', 'Disclaimer', 'محتوى تعليمي.', 'Educational content.'),
    ],
  },
  {
    id: 'art-nitrogen-timing', slug: 'nitrogen-timing-wheat', titleAr: 'توقيت الأزوت في القمح: بعد الزراعة لا يعني دفعة واحدة', titleEn: 'Wheat nitrogen timing: after planting is not one dump',
    excerptAr: 'الدفعة المتأخرة قد تزيد الرقاد دون أن تزيد المحصول.', excerptEn: 'A late dump may increase lodging without increasing yield.',
    coverImage: '/assets/images/academy/nitrogen.webp', categoryId: 'ac-nutrition', authorId: 'au-omar', publishedAt: '2025-12-18T08:00:00.000Z', updatedAt: '2026-01-04T08:00:00.000Z', readingMinutes: 6, views: 2104, featured: false, status: 'published',
    cropIds: ['crop-wheat'], problemIds: ['pr-yellow'], relatedProductIds: ['p29', 'p08'], relatedArticleIds: ['art-wheat-rust'], relatedCategoryIds: ['cat-fertilizers'],
    seoTitleAr: 'توقيت التسميد الأزوتي للقمح', seoTitleEn: 'Wheat nitrogen timing', seoDescriptionAr: 'تقسيم دفعات الأزوت حسب مرحلة النمو.', seoDescriptionEn: 'Splitting nitrogen by growth stage.',
    sections: [
      section('التقسيم', 'Splitting', 'دفعتان أو ثلاث أوضح من دفعة واحدة كبيرة.', 'Two or three splits are clearer than one large application.'),
      section('تنويه', 'Disclaimer', 'التوصية الحقلية تختلف حسب التحليل والمنطقة.', 'Field rates differ by analysis and region.'),
    ],
  },
  {
    id: 'art-virus-vectors', slug: 'insect-virus-vectors', titleAr: 'الحشرات الناقلة للفيروسات: المن والذبابة البيضاء', titleEn: 'Virus-vector insects: aphids and whitefly',
    excerptAr: 'إيقاف الفيروس بعد دخوله النبات غير ممكن بالمبيد. الإدارة تبدأ من المنع.', excerptEn: 'A virus cannot be stopped with insecticide after it enters the plant. Management starts with prevention.',
    coverImage: '/assets/images/academy/viruses.webp', categoryId: 'ac-protection', authorId: 'au-sara', publishedAt: '2026-04-22T08:00:00.000Z', updatedAt: '2026-04-22T08:00:00.000Z', readingMinutes: 7, views: 1188, featured: false, status: 'published',
    cropIds: ['crop-pepper', 'crop-tomato'], problemIds: ['pr-aphid', 'pr-whitefly'], relatedProductIds: ['p01', 'p18'], relatedArticleIds: ['art-tomato-whitefly'], relatedCategoryIds: ['cat-insecticides'],
    seoTitleAr: 'الحشرات الناقلة للفيروسات', seoTitleEn: 'Insect virus vectors', seoDescriptionAr: 'المن والذبابة البيضاء ونقل الفيروسات.', seoDescriptionEn: 'Aphids, whitefly, and virus transmission.',
    sections: [
      section('شتلات سليمة', 'Clean seedlings', 'شتلة مصابة تدخل الفيروس إلى الحقل كله.', 'An infected seedling brings virus into the whole field.'),
      section('تنويه', 'Disclaimer', 'لا يوجد علاج فيروسي كيميائي ميداني معتمد كهذا المقال.', 'There is no field chemical virus cure as implied here.'),
    ],
  },
  {
    id: 'art-fruit-sizing', slug: 'fruit-sizing-program', titleAr: 'تحجيم الثمار: حمل، ماء، وبوتاسيوم', titleEn: 'Fruit sizing: crop load, water, and potassium',
    excerptAr: 'منتج التحجيم لا يعوّض الحمل الزائد أو الري المقطوع.', excerptEn: 'A sizing product does not offset overcropping or interrupted irrigation.',
    coverImage: '/assets/images/academy/sizing.webp', categoryId: 'ac-nutrition', authorId: 'au-omar', publishedAt: '2026-05-19T08:00:00.000Z', updatedAt: '2026-05-19T08:00:00.000Z', readingMinutes: 6, views: 905, featured: false, status: 'published',
    cropIds: ['crop-pepper', 'crop-tomato'], problemIds: ['pr-small-fruit'], relatedProductIds: ['p09', 'p14', 'p08'], relatedArticleIds: ['art-fruit-set'], relatedCategoryIds: ['cat-fertilizers', 'cat-growth'],
    seoTitleAr: 'برنامج تحجيم الثمار', seoTitleEn: 'Fruit sizing program', seoDescriptionAr: 'الحمل والري والبوتاسيوم قبل أي منظم.', seoDescriptionEn: 'Crop load, irrigation, and potassium before any regulator.',
    sections: [
      section('الخف', 'Thinning', 'الإبقاء على كل الثمار يصغّر الجميع.', 'Keeping every fruit makes all of them smaller.'),
      section('تنويه', 'Disclaimer', 'النتائج تختلف بين الصوب والحقل المكشوف.', 'Results differ between greenhouses and open field.'),
    ],
  },
  {
    id: 'art-greenhouse-humidity', slug: 'greenhouse-humidity', titleAr: 'رطوبة الصوب: بياض زغبي وذبابة بيضاء معًا', titleEn: 'Greenhouse humidity: downy mildew and whitefly together',
    excerptAr: 'خفض الرطوبة ليلاً يغيّر ضغط مرضين في وقت واحد.', excerptEn: 'Lowering night humidity changes pressure from two problems at once.',
    coverImage: '/assets/images/academy/greenhouse.webp', categoryId: 'ac-practice', authorId: 'au-laila', publishedAt: '2026-03-29T08:00:00.000Z', updatedAt: '2026-03-29T08:00:00.000Z', readingMinutes: 6, views: 1012, featured: false, status: 'published',
    cropIds: ['crop-cucumber', 'crop-tomato'], problemIds: ['pr-mildew', 'pr-whitefly'], relatedProductIds: ['p04', 'p01'], relatedArticleIds: ['art-tomato-whitefly', 'art-grey-mold'], relatedCategoryIds: ['cat-fungicides'],
    seoTitleAr: 'إدارة رطوبة البيوت المحمية', seoTitleEn: 'Managing greenhouse humidity', seoDescriptionAr: 'التهوية الليلية والأمراض والحشرات.', seoDescriptionEn: 'Night ventilation, diseases, and insects.',
    sections: [
      section('فتحات التهوية', 'Vents', 'جدولة الفتح أهم من شراء جهاز إضافي أحيانًا.', 'A vent schedule sometimes matters more than extra equipment.'),
      section('تنويه', 'Disclaimer', 'كل صوبة تختلف في التوجيه والعزل.', 'Each house differs in orientation and insulation.'),
    ],
  },
  {
    id: 'art-leaf-spots', slug: 'reading-leaf-spots', titleAr: 'كيف تقرأ تبقعات الأوراق دون استنتاج متسرع؟', titleEn: 'How to read leaf spots without jumping to conclusions',
    excerptAr: 'البقعة قد تكون فطرًا أو نقص عنصر أو لسعة حشرة. الشكل والتوزيع هما الدليل.', excerptEn: 'A spot may be a fungus, a deficiency, or insect feeding. Pattern and distribution are the clues.',
    coverImage: '/assets/images/academy/spots.webp', categoryId: 'ac-practice', authorId: 'au-laila', publishedAt: '2026-06-02T08:00:00.000Z', updatedAt: '2026-06-02T08:00:00.000Z', readingMinutes: 5, views: 540, featured: false, status: 'published',
    cropIds: ['crop-onion', 'crop-grapes'], problemIds: ['pr-spots'], relatedProductIds: ['p03', 'p19'], relatedArticleIds: ['art-wheat-rust', 'art-potato-blight'], relatedCategoryIds: ['cat-fungicides'],
    seoTitleAr: 'قراءة تبقعات الأوراق', seoTitleEn: 'Reading leaf spots', seoDescriptionAr: 'لا تعتمد على اللون وحده.', seoDescriptionEn: 'Do not rely on color alone.',
    sections: [
      section('التوزيع', 'Distribution', 'بقع منتشرة عشوائيًا تختلف عن اصفرار منتظم بين العروق.', 'Random spots differ from uniform interveinal yellowing.'),
      section('تنويه', 'Disclaimer', 'التشخيص المخبري أدق.', 'Lab diagnosis is more accurate.'),
    ],
  },
  {
    id: 'art-spray-coverage', slug: 'spray-coverage', titleAr: 'تغطية الرش: الماء، الضغط، ووجه الورقة', titleEn: 'Spray coverage: water, pressure, and the leaf face',
    excerptAr: 'نصف حالات فشل المكافحة سببها التغطية لا المركب.', excerptEn: 'Half of control failures come from coverage, not the compound.',
    coverImage: '/assets/images/academy/spray.webp', categoryId: 'ac-practice', authorId: 'au-sara', publishedAt: '2026-07-07T08:00:00.000Z', updatedAt: '2026-07-07T08:00:00.000Z', readingMinutes: 6, views: 1288, featured: false, status: 'published',
    cropIds: ['crop-tomato', 'crop-grapes', 'crop-onion'], problemIds: ['pr-insects', 'pr-mildew'], relatedProductIds: ['p17', 'p01'], relatedArticleIds: ['art-onion-thrips', 'art-tomato-whitefly'], relatedCategoryIds: ['cat-supplies'],
    seoTitleAr: 'تغطية الرش في المحاصيل', seoTitleEn: 'Spray coverage in crops', seoDescriptionAr: 'كمية الماء والضغط والسطح السفلي للورقة.', seoDescriptionEn: 'Water volume, pressure, and the underside of the leaf.',
    sections: [
      section('السطح السفلي', 'Underside', 'المن والحلم يعيشان غالبًا أسفل الورقة.', 'Aphids and mites often live under the leaf.'),
      section('تنويه', 'Disclaimer', 'معايرة المرشة مسؤولية المشغّل.', 'Calibrating the sprayer is the operator’s responsibility.'),
    ],
  },
];

export const ARTICLES: Article[] = ARTICLE_ROWS.map((a) => ({
  ...a,
  status: a.status as Article['status'],
  socialImage: a.coverImage,
  imageAltAr: a.titleAr,
  imageAltEn: a.titleEn,
}));

export const REVIEWS: Review[] = [
  { id: 'rv1', productId: 'p01', userId: 'u-customer', userName: 'أحمد فوزي', rating: 5, titleAr: 'تغطية جيدة على الطماطم', titleEn: 'Good coverage on tomato', bodyAr: 'استخدمته ضمن برنامج المهندس على عروة صيفي. التغطية كانت أهم درس.', bodyEn: 'Used within an agronomist program on a summer cycle. Coverage was the main lesson.', createdAt: '2026-05-12T10:00:00.000Z', approved: true },
  { id: 'rv2', productId: 'p03', userId: 'u-eng', userName: 'م. ندى حسين', rating: 4, titleAr: 'وقائي مناسب للرطوبة', titleEn: 'Decent preventive in humidity', bodyAr: 'أضفته لجدول البطاطس قبل موجة الندى. النتيجة مرتبطة بالتوقيت.', bodyEn: 'Added it to a potato schedule before a dew wave. Results followed timing.', createdAt: '2026-01-20T10:00:00.000Z', approved: true },
  { id: 'rv3', productId: 'p08', userId: 'u-retail', userName: 'محمود عبد العال', rating: 5, titleAr: 'ذوبان سريع', titleEn: 'Dissolves quickly', bodyAr: 'سهل في شبكة الري بالتنقيط لمزرعتنا الصغيرة.', bodyEn: 'Easy in our small drip network.', createdAt: '2026-04-02T10:00:00.000Z', approved: true },
  { id: 'rv4', productId: 'p07', userId: 'u-customer', userName: 'أحمد فوزي', rating: 5, titleAr: 'الحلم انخفض بعد الرشة', titleEn: 'Mites dropped after the spray', bodyAr: 'مع تغطية السطح السفلي في الموالح.', bodyEn: 'With underside coverage in citrus.', createdAt: '2026-06-18T10:00:00.000Z', approved: true },
  { id: 'rv5', productId: 'p15', userId: 'u-farm', userName: 'حسام الدسوقي', rating: 4, titleAr: 'مفيد مع قياس EC', titleEn: 'Useful with EC measurement', bodyAr: 'بدون قياس المياه كنت سأضيع الميزانية.', bodyEn: 'Without measuring water I would have wasted the budget.', createdAt: '2026-05-28T10:00:00.000Z', approved: true },
  { id: 'rv6', productId: 'p27', userId: 'u-eng', userName: 'م. ندى حسين', rating: 5, titleAr: 'الحديد ظهر على النمو الحديث', titleEn: 'Iron showed on new growth', bodyAr: 'في بستان موالح على أرض جيرية.', bodyEn: 'In a citrus grove on calcareous soil.', createdAt: '2026-03-11T10:00:00.000Z', approved: true },
  { id: 'rv7', productId: 'p17', userId: 'u-home', userName: 'ياسمين كمال', rating: 4, titleAr: 'مناسب لحديقة منزلية', titleEn: 'Fine for a home garden', bodyAr: 'الخزان خفيف والتنظيف سهل.', bodyEn: 'The tank is light and cleaning is easy.', createdAt: '2026-07-01T10:00:00.000Z', approved: true },
  { id: 'rv8', productId: 'p04', userId: 'u-farm', userName: 'حسام الدسوقي', rating: 5, titleAr: 'البياض على العنب تراجع', titleEn: 'Grape mildew receded', bodyAr: 'ضمن برنامج وقائي قبل الإزهار وليس كإنقاذ متأخر.', bodyEn: 'Inside a preventive pre-bloom program, not as a late rescue.', createdAt: '2026-03-22T10:00:00.000Z', approved: true },
];

export const FAQS: FaqItem[] = [
  { id: 'f1', category: 'ordering', questionAr: 'هل يمكن الطلب دون إنشاء حساب؟', questionEn: 'Can I order without an account?', answerAr: 'نعم، يدعم المتجر الشراء كضيف. بعد الطلب يمكنك إنشاء حساب لتتبع الطلبات.', answerEn: 'Yes, guest checkout is supported. After ordering you can create an account to track orders.' },
  { id: 'f2', category: 'ordering', questionAr: 'كيف أستخدم كوبون الخصم؟', questionEn: 'How do I use a coupon?', answerAr: 'أدخل الرمز في سلة التسوق قبل إتمام الدفع. يظهر الخطأ إذا كان الكوبون غير صالح أو دون الحد الأدنى.', answerEn: 'Enter the code in the cart before checkout. An error appears if the coupon is invalid or below the minimum.' },
  { id: 'f3', category: 'shipping', questionAr: 'ما مدة التوصيل داخل مصر؟', questionEn: 'What is delivery time in Egypt?', answerAr: 'المدد المعروضة تقديرية حسب طريقة الشحن المختارة والمحافظة. التأكيد النهائي يتم عند تجهيز الطلب.', answerEn: 'Shown times are estimates based on the selected method and governorate. Final confirmation happens when the order is prepared.' },
  { id: 'f4', category: 'shipping', questionAr: 'هل تشحنون لكل المحافظات؟', questionEn: 'Do you ship to all governorates?', answerAr: 'نعم في الوضع التجريبي. بعض المناطق النائية قد تحتاج مدة إضافية.', answerEn: 'Yes in this demo. Some remote areas may need extra time.' },
  { id: 'f5', category: 'returns', questionAr: 'متى يمكن طلب الإرجاع؟', questionEn: 'When can I request a return?', answerAr: 'المنتجات غير المستخدمة وبعبواتها خلال المدة المذكورة في سياسة الإرجاع، مع استثناءات لمواد وقاية النبات المفتوحة.', answerEn: 'Unused sealed products within the returns-policy window, with exceptions for opened crop-protection materials.' },
  { id: 'f6', category: 'products', questionAr: 'هل المعلومات الزراعية تشخيص مؤكد؟', questionEn: 'Is the agricultural information a confirmed diagnosis?', answerAr: 'لا. المساعد والمقالات إرشاد عام. يجب الالتزام بملصق المنتج وتعليمات وزارة الزراعة واستشارة مهندس زراعي عند الحاجة.', answerEn: 'No. The assistant and articles are general guidance. Follow the label, official instructions, and consult an agronomist.' },
  { id: 'f7', category: 'accounts', questionAr: 'نسيت كلمة المرور، ماذا أفعل؟', questionEn: 'I forgot my password. What should I do?', answerAr: 'استخدم صفحة استعادة كلمة المرور. في الوضع التجريبي يصل رمز تحقق وهمي موثّق في ملف README.', answerEn: 'Use the forgot-password page. In mock mode a documented demo code is used; see the README.' },
  { id: 'f8', category: 'usage', questionAr: 'هل يمكن خلط المنتجات في خزان واحد؟', questionEn: 'Can products be tank-mixed?', answerAr: 'لا تخلط إلا بعد اختبار التوافق واتباع الملصقات. المنصة لا تعتمد خلطات جاهزة.', answerEn: 'Mix only after a compatibility test and following labels. The platform does not endorse ready tank mixes.' },
];
