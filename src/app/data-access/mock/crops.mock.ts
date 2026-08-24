import { ClarifyingQuestion, Crop, CropStage, PlantProblem, Symptom, SymptomVisual } from '@core/models';

const CROP_ROWS = [
  { id: 'crop-wheat', slug: 'wheat', nameAr: 'القمح', nameEn: 'Wheat', overviewAr: 'محصول حبوب شتوي أساسي في مصر. تحتاج برامجه إلى متابعة الأصداء والمن والتغذية النيتروجينية في التوقيت الصحيح.', overviewEn: 'A core winter cereal in Egypt. Programs focus on rusts, aphids, and timely nitrogen.', image: '/images/crops/wheat.svg', seasonAr: 'شتوي', seasonEn: 'Winter', commonProblemIds: ['pr-rust', 'pr-aphid', 'pr-yellow'], relatedCategoryIds: ['cat-fungicides', 'cat-insecticides', 'cat-fertilizers'], relatedArticleIds: ['art-wheat-rust', 'art-nitrogen-timing'] },
  { id: 'crop-potato', slug: 'potato', nameAr: 'البطاطس', nameEn: 'Potato', overviewAr: 'محصول درنات حسّاس للندوة المتأخرة والنيماتودا وملوحة مياه الري.', overviewEn: 'A tuber crop sensitive to late blight, nematodes, and saline irrigation.', image: '/images/crops/potato.svg', seasonAr: 'شتوي / نيلي', seasonEn: 'Winter / Nili', commonProblemIds: ['pr-blight', 'pr-nematode', 'pr-salinity'], relatedCategoryIds: ['cat-fungicides', 'cat-nematicides', 'cat-salinity'], relatedArticleIds: ['art-potato-blight', 'art-root-health'] },
  { id: 'crop-tomato', slug: 'tomato', nameAr: 'الطماطم', nameEn: 'Tomato', overviewAr: 'تحتاج إدارة دقيقة للذبابة البيضاء والعفن والبياض والاحتياجات الغذائية أثناء العقد.', overviewEn: 'Needs careful management of whitefly, molds, mildew, and nutrition during fruit set.', image: '/images/crops/tomato.svg', seasonAr: 'على مدار العام حسب العروة', seasonEn: 'Year-round by cycle', commonProblemIds: ['pr-whitefly', 'pr-mildew', 'pr-set'], relatedCategoryIds: ['cat-insecticides', 'cat-fungicides', 'cat-growth'], relatedArticleIds: ['art-tomato-whitefly', 'art-fruit-set'] },
  { id: 'crop-onion', slug: 'onion', nameAr: 'البصل', nameEn: 'Onion', overviewAr: 'يتأثر بالثrips والبياض الزغبي وأمراض المجموع الخضري في الرطوبة العالية.', overviewEn: 'Affected by thrips, downy mildew, and foliage diseases in high humidity.', image: '/images/crops/onion.svg', seasonAr: 'شتوي', seasonEn: 'Winter', commonProblemIds: ['pr-thrips', 'pr-mildew', 'pr-spots'], relatedCategoryIds: ['cat-insecticides', 'cat-fungicides'], relatedArticleIds: ['art-onion-thrips'] },
  { id: 'crop-citrus', slug: 'citrus', nameAr: 'الموالح', nameEn: 'Citrus', overviewAr: 'برامج الحلم والمن وتبقعات الأوراق والتغذية بالزنك والحديد شائعة في بساتين الموالح.', overviewEn: 'Mite, aphid, leaf-spot, and zinc/iron nutrition programs are common in citrus groves.', image: '/images/crops/citrus.svg', seasonAr: 'مستديم', seasonEn: 'Perennial', commonProblemIds: ['pr-mite', 'pr-aphid', 'pr-yellow'], relatedCategoryIds: ['cat-acaricides', 'cat-nutrients'], relatedArticleIds: ['art-citrus-mites', 'art-micronutrients'] },
  { id: 'crop-mango', slug: 'mango', nameAr: 'المانجو', nameEn: 'Mango', overviewAr: 'البياض الدقيقي على الأزهار والحلم والتغذية أثناء العقد من أهم محاور المانجو.', overviewEn: 'Powdery mildew on blossom, mites, and nutrition during fruit set are key mango topics.', image: '/images/crops/mango.svg', seasonAr: 'مستديم', seasonEn: 'Perennial', commonProblemIds: ['pr-mildew', 'pr-mite', 'pr-set'], relatedCategoryIds: ['cat-fungicides', 'cat-acaricides', 'cat-growth'], relatedArticleIds: ['art-mango-bloom'] },
  { id: 'crop-grapes', slug: 'grapes', nameAr: 'العنب', nameEn: 'Grapes', overviewAr: 'البياض الدقيقي والزغبي ودودة الثمار تتطلب جدولة رش دقيقة قبل وبعد الإزهار.', overviewEn: 'Powdery and downy mildew and berry moth require precise spray timing around bloom.', image: '/images/crops/grapes.svg', seasonAr: 'مستديم', seasonEn: 'Perennial', commonProblemIds: ['pr-mildew', 'pr-spots', 'pr-insects'], relatedCategoryIds: ['cat-fungicides', 'cat-insecticides'], relatedArticleIds: ['art-grape-mildew'] },
  { id: 'crop-cucumber', slug: 'cucumber', nameAr: 'الخيار', nameEn: 'Cucumber', overviewAr: 'في البيوت المحمية تظهر البياض الزغبي والذبابة البيضاء بسرعة مع الرطوبة والحرارة.', overviewEn: 'In greenhouses, downy mildew and whitefly spread quickly with humidity and heat.', image: '/images/crops/cucumber.svg', seasonAr: 'محمي / مكشوف', seasonEn: 'Protected / open', commonProblemIds: ['pr-mildew', 'pr-whitefly', 'pr-wilt'], relatedCategoryIds: ['cat-fungicides', 'cat-insecticides'], relatedArticleIds: ['art-greenhouse-humidity'] },
  { id: 'crop-pepper', slug: 'pepper', nameAr: 'الفلفل', nameEn: 'Pepper', overviewAr: 'حساس للمن والفيروسات المنقولة بالحشرات، ويحتاج تغذية متزنة أثناء التحجيم.', overviewEn: 'Sensitive to aphids and insect-borne viruses; needs balanced nutrition during sizing.', image: '/images/crops/pepper.svg', seasonAr: 'صيفي / محمي', seasonEn: 'Summer / protected', commonProblemIds: ['pr-aphid', 'pr-wilt', 'pr-small-fruit'], relatedCategoryIds: ['cat-insecticides', 'cat-nutrients'], relatedArticleIds: ['art-virus-vectors'] },
  { id: 'crop-strawberry', slug: 'strawberry', nameAr: 'الفراولة', nameEn: 'Strawberry', overviewAr: 'العنكبوت الأحمر والعفن الرمادي وتملح الطبقة السطحية من التحديات المتكررة.', overviewEn: 'Red spider mite, grey mold, and surface salinity are recurring challenges.', image: '/images/crops/strawberry.svg', seasonAr: 'شتوي', seasonEn: 'Winter', commonProblemIds: ['pr-mite', 'pr-rot', 'pr-salinity'], relatedCategoryIds: ['cat-acaricides', 'cat-fungicides', 'cat-salinity'], relatedArticleIds: ['art-strawberry-mites', 'art-grey-mold'] },
];

export const CROPS: Crop[] = CROP_ROWS.map((c) => {
  const image = `/assets/images/crops/${c.slug}-crop.webp`;
  return {
    ...c,
    image,
    thumbnail: image,
    imageAltAr: `محصول ${c.nameAr}`,
    imageAltEn: `${c.nameEn} crop`,
  };
});

export const CROP_STAGES: CropStage[] = CROP_ROWS.flatMap((crop) =>
  (
    [
      ['seedling', 'شتلات / إنبات', 'Seedling', 'مرحلة الإنبات والبادرات.', 'Germination and seedling stage.'],
      ['vegetative', 'نمو خضري', 'Vegetative', 'بناء المجموع الخضري والجذور.', 'Canopy and root development.'],
      ['flowering', 'إزهار', 'Flowering', 'بداية التزهير وتكوين الأعضاء الزهرية.', 'Bloom and floral organ formation.'],
      ['fruiting', 'عقد وإثمار', 'Fruiting', 'العقد ونمو الثمار أو الحبوب.', 'Fruit set and fruit or grain growth.'],
      ['maturity', 'نضج', 'Maturity', 'اقتراب الحصاد وفترة ما قبل الجمع.', 'Approaching harvest and pre-harvest interval.'],
    ] as const
  ).map(([code, nameAr, nameEn, descriptionAr, descriptionEn]) => ({
    id: `${crop.id}-${code}`,
    cropId: crop.id,
    code,
    nameAr,
    nameEn,
    descriptionAr,
    descriptionEn,
  })),
);

export const SYMPTOM_ROWS = [
  { id: 'sy-yellow', nameAr: 'اصفرار الأوراق', nameEn: 'Leaf yellowing', descriptionAr: 'تغير لون الأوراق إلى الأصفر على القديم أو الحديث.', descriptionEn: 'Leaves turning yellow on old or new growth.' },
  { id: 'sy-spots', nameAr: 'تبقعات الأوراق', nameEn: 'Leaf spots', descriptionAr: 'بقع بنية أو رمادية أو محاطة بهالة.', descriptionEn: 'Brown, grey, or haloed spots on leaves.' },
  { id: 'sy-roots', nameAr: 'ضعف الجذور', nameEn: 'Weak roots', descriptionAr: 'مجموع جذري محدود أو متقزم.', descriptionEn: 'Limited or stunted root system.' },
  { id: 'sy-wilt', nameAr: 'ذبول', nameEn: 'Wilting', descriptionAr: 'ترهل النبات حتى مع وجود رطوبة.', descriptionEn: 'Plant collapse even when moisture is present.' },
  { id: 'sy-flower', nameAr: 'ضعف الإزهار', nameEn: 'Poor flowering', descriptionAr: 'أزهار قليلة أو تساقط مبكر.', descriptionEn: 'Few flowers or early flower drop.' },
  { id: 'sy-set', nameAr: 'ضعف العقد', nameEn: 'Poor fruit setting', descriptionAr: 'أزهار لا تتحول إلى ثمار بشكل كافٍ.', descriptionEn: 'Flowers failing to convert into fruit.' },
  { id: 'sy-small', nameAr: 'ثمار صغيرة', nameEn: 'Small fruits', descriptionAr: 'حجم ثمار أقل من المتوقع للعروة.', descriptionEn: 'Fruit size below the expected cycle average.' },
  { id: 'sy-insects', nameAr: 'وجود حشرات', nameEn: 'Insect presence', descriptionAr: 'حشرات ظاهرة على الأوراق أو الثمار.', descriptionEn: 'Visible insects on leaves or fruit.' },
  { id: 'sy-powder', nameAr: 'مسحوق أبيض على الأوراق', nameEn: 'White powder on leaves', descriptionAr: 'تغطية بيضاء تشبه الدقيق.', descriptionEn: 'White flour-like covering on leaves.' },
  { id: 'sy-rot', nameAr: 'عفن الجذور', nameEn: 'Root rot', descriptionAr: 'جذور بنية طرية مع رائحة غير طبيعية أحيانًا.', descriptionEn: 'Brown, soft roots, sometimes with an unusual smell.' },
  { id: 'sy-salt', nameAr: 'إجهاد ملحي', nameEn: 'Salinity stress', descriptionAr: 'حواف محترقة ونمو بطيء في وجود مياه مالحة.', descriptionEn: 'Leaf-margin burn and slow growth with saline water.' },
];

const SYMPTOM_FILES: Record<string, string> = {
  'sy-yellow': 'leaf-yellowing',
  'sy-spots': 'leaf-spots',
  'sy-roots': 'root-knot-nematode',
  'sy-wilt': 'wilting',
  'sy-flower': 'poor-fruit-set',
  'sy-set': 'poor-fruit-set',
  'sy-small': 'small-fruit',
  'sy-insects': 'aphids',
  'sy-powder': 'powdery-mildew',
  'sy-rot': 'root-rot',
  'sy-salt': 'salinity-stress',
};

export const SYMPTOMS: Symptom[] = SYMPTOM_ROWS.map((s) => {
  const image = `/assets/images/problems/${SYMPTOM_FILES[s.id] ?? 'leaf-yellowing'}.webp`;
  return {
    ...s,
    image,
    thumbnail: image,
    imageAltAr: s.nameAr,
    imageAltEn: s.nameEn,
  };
});

export const PROBLEM_ROWS = [
  { id: 'pr-aphid', slug: 'aphids', nameAr: 'المن', nameEn: 'Aphids', descriptionAr: 'حشرات ثاقبة ماصة تضعف النبات وقد تنقل فيروسات.', descriptionEn: 'Sucking insects that weaken plants and may vector viruses.', educationalNoteAr: 'وجود المن لا يعني تلقائيًا اختيار مبيد معين؛ راقب الأعداء الحيوية وتوقيت الرش.', educationalNoteEn: 'Aphid presence does not automatically dictate a specific insecticide; consider beneficials and timing.', symptomIds: ['sy-insects', 'sy-yellow'], cropIds: ['crop-wheat', 'crop-citrus', 'crop-pepper'], relatedCategoryIds: ['cat-insecticides'], relatedArticleIds: ['art-virus-vectors'] },
  { id: 'pr-whitefly', slug: 'whitefly', nameAr: 'الذبابة البيضاء', nameEn: 'Whitefly', descriptionAr: 'حشرة شائعة على الطماطم والخيار وتنقل فيروسات.', descriptionEn: 'A common insect on tomato and cucumber and a virus vector.', educationalNoteAr: 'الإدارة المتكاملة أهم من الرش المتكرر.', educationalNoteEn: 'Integrated management matters more than repeated spraying.', symptomIds: ['sy-insects', 'sy-yellow'], cropIds: ['crop-tomato', 'crop-cucumber'], relatedCategoryIds: ['cat-insecticides'], relatedArticleIds: ['art-tomato-whitefly'] },
  { id: 'pr-thrips', slug: 'thrips', nameAr: 'التربس', nameEn: 'Thrips', descriptionAr: 'حشرات صغيرة تسبب تشوه الأوراق والثمار.', descriptionEn: 'Tiny insects causing leaf and fruit distortion.', educationalNoteAr: 'التربس يختبئ في الأزهار؛ التغطية الجيدة للرش مهمة.', educationalNoteEn: 'Thrips hide in flowers; spray coverage is important.', symptomIds: ['sy-insects', 'sy-spots'], cropIds: ['crop-onion', 'crop-pepper'], relatedCategoryIds: ['cat-insecticides'], relatedArticleIds: ['art-onion-thrips'] },
  { id: 'pr-mite', slug: 'spider-mite', nameAr: 'العنكبوت الأحمر', nameEn: 'Red spider mite', descriptionAr: 'أكاروس ينشط مع الحرارة والجفاف ويترك تبقعًا باهتًا وخيوطًا دقيقة.', descriptionEn: 'A mite favored by heat and dryness, leaving stippling and fine webbing.', educationalNoteAr: 'المبيدات الحشرية العادية قد لا تكفي؛ يحتاج مركبات أكاروسية مناسبة.', educationalNoteEn: 'Ordinary insecticides may not suffice; appropriate acaricides are needed.', symptomIds: ['sy-insects', 'sy-yellow'], cropIds: ['crop-citrus', 'crop-mango', 'crop-strawberry'], relatedCategoryIds: ['cat-acaricides'], relatedArticleIds: ['art-citrus-mites', 'art-strawberry-mites'] },
  { id: 'pr-mildew', slug: 'powdery-mildew', nameAr: 'البياض الدقيقي', nameEn: 'Powdery mildew', descriptionAr: 'مسحوق أبيض على الأوراق والأزهار في العنب والمانجو والخيار.', descriptionEn: 'White powder on leaves and flowers in grapes, mango, and cucumber.', educationalNoteAr: 'الوقاية قبل انتشار الإصابة أوفر من العلاج المتأخر.', educationalNoteEn: 'Prevention before spread is more efficient than late treatment.', symptomIds: ['sy-powder', 'sy-spots'], cropIds: ['crop-grapes', 'crop-mango', 'crop-cucumber', 'crop-tomato'], relatedCategoryIds: ['cat-fungicides'], relatedArticleIds: ['art-grape-mildew'] },
  { id: 'pr-blight', slug: 'late-blight', nameAr: 'الندوة المتأخرة', nameEn: 'Late blight', descriptionAr: 'مرض فطري خطير على البطاطس في الرطوبة والبرودة النسبية.', descriptionEn: 'A serious fungal disease of potato in humid, relatively cool conditions.', educationalNoteAr: 'البرامج الوقائية مرتبطة بنشرة الأمراض الجوية.', educationalNoteEn: 'Preventive programs should follow disease-weather guidance.', symptomIds: ['sy-spots', 'sy-wilt'], cropIds: ['crop-potato'], relatedCategoryIds: ['cat-fungicides'], relatedArticleIds: ['art-potato-blight'] },
  { id: 'pr-rust', slug: 'wheat-rust', nameAr: 'أصداء القمح', nameEn: 'Wheat rust', descriptionAr: 'مرض فطري يظهر بثورًا على الأوراق ويخفض التمثيل الضوئي.', descriptionEn: 'A fungal disease producing pustules on leaves and reducing photosynthesis.', educationalNoteAr: 'الأصناف المقاومة والرش في التوقيت الصحيح محور البرنامج.', educationalNoteEn: 'Resistant varieties and well-timed sprays are central.', symptomIds: ['sy-spots', 'sy-yellow'], cropIds: ['crop-wheat'], relatedCategoryIds: ['cat-fungicides'], relatedArticleIds: ['art-wheat-rust'] },
  { id: 'pr-nematode', slug: 'root-knot-nematode', nameAr: 'نيماتودا تعقد الجذور', nameEn: 'Root-knot nematode', descriptionAr: 'تسبب عقدًا على الجذور وضعف امتصاص الماء والغذاء.', descriptionEn: 'Causes root galls and poor water and nutrient uptake.', educationalNoteAr: 'التشخيص المخبري أدق من الأعراض الظاهرية وحدها.', educationalNoteEn: 'Lab diagnosis is more accurate than visual symptoms alone.', symptomIds: ['sy-roots', 'sy-wilt', 'sy-yellow'], cropIds: ['crop-potato', 'crop-tomato'], relatedCategoryIds: ['cat-nematicides'], relatedArticleIds: ['art-root-health'] },
  { id: 'pr-rot', slug: 'root-rot', nameAr: 'أعفان الجذور', nameEn: 'Root rot', descriptionAr: 'مجموعة أمراض تربة تظهر بذبول وتعفن الجذور مع سوء الصرف.', descriptionEn: 'Soil diseases showing wilt and root decay with poor drainage.', educationalNoteAr: 'تحسين الصرف والري أهم من أي منتج بمفرده.', educationalNoteEn: 'Drainage and irrigation improvement matter more than any single product.', symptomIds: ['sy-rot', 'sy-wilt', 'sy-roots'], cropIds: ['crop-strawberry', 'crop-cucumber'], relatedCategoryIds: ['cat-fungicides', 'cat-nutrients'], relatedArticleIds: ['art-root-health'] },
  { id: 'pr-salinity', slug: 'salinity-stress', nameAr: 'إجهاد الملوحة', nameEn: 'Salinity stress', descriptionAr: 'احتراق حواف الأوراق وضعف النمو مع ارتفاع ملوحة التربة أو المياه.', descriptionEn: 'Leaf-margin burn and weak growth with high soil or water salinity.', educationalNoteAr: 'المعالجات مساعدة؛ مصدر المياه ونظام الغسيل هما الأساس.', educationalNoteEn: 'Treatments are supportive; water source and leaching are fundamental.', symptomIds: ['sy-salt', 'sy-yellow', 'sy-small'], cropIds: ['crop-potato', 'crop-strawberry'], relatedCategoryIds: ['cat-salinity', 'cat-nutrients'], relatedArticleIds: ['art-salinity-water'] },
  { id: 'pr-set', slug: 'poor-fruit-set', nameAr: 'ضعف العقد', nameEn: 'Poor fruit set', descriptionAr: 'فشل الأزهار في التحول إلى ثمار بسبب الحرارة أو التغذية أو الري.', descriptionEn: 'Flowers failing to set fruit due to heat, nutrition, or irrigation.', educationalNoteAr: 'منظمات النمو ليست تعويضًا عن الإجهاد الحراري أو نقص التلقيح.', educationalNoteEn: 'Growth regulators do not replace heat stress management or pollination.', symptomIds: ['sy-set', 'sy-flower'], cropIds: ['crop-tomato', 'crop-mango'], relatedCategoryIds: ['cat-growth', 'cat-nutrients'], relatedArticleIds: ['art-fruit-set', 'art-mango-bloom'] },
  { id: 'pr-small-fruit', slug: 'small-fruit', nameAr: 'صغر حجم الثمار', nameEn: 'Small fruit size', descriptionAr: 'تحجيم ضعيف مرتبط بالحمل الزائد أو نقص البوتاسيوم والماء.', descriptionEn: 'Poor sizing linked to overcropping or potassium and water deficit.', educationalNoteAr: 'التحجيم نتيجة برنامج كامل وليس منتجًا واحدًا.', educationalNoteEn: 'Sizing is the result of a full program, not a single product.', symptomIds: ['sy-small'], cropIds: ['crop-pepper', 'crop-tomato'], relatedCategoryIds: ['cat-growth', 'cat-fertilizers'], relatedArticleIds: ['art-fruit-sizing'] },
  { id: 'pr-yellow', slug: 'leaf-yellowing', nameAr: 'اصفرار الأوراق', nameEn: 'Leaf yellowing', descriptionAr: 'عرض مشترك لنقص عناصر أو ري غير مناسب أو إصابة مجاميع جذرية.', descriptionEn: 'A shared symptom of nutrient deficit, irrigation issues, or root problems.', educationalNoteAr: 'حدد إن كان الاصفرار على الأوراق القديمة أم الحديثة قبل اختيار المغذي.', educationalNoteEn: 'Determine whether yellowing is on old or new leaves before choosing a nutrient.', symptomIds: ['sy-yellow'], cropIds: ['crop-wheat', 'crop-citrus'], relatedCategoryIds: ['cat-nutrients', 'cat-fertilizers'], relatedArticleIds: ['art-micronutrients', 'art-nitrogen-timing'] },
  { id: 'pr-spots', slug: 'leaf-spots', nameAr: 'تبقعات الأوراق', nameEn: 'Leaf spots', descriptionAr: 'بقع قد تكون فطرية أو بكتيرية أو لسعات حشرية.', descriptionEn: 'Spots may be fungal, bacterial, or insect feeding marks.', educationalNoteAr: 'الشكل والتوزيع يوجه التشخيص أكثر من لون البقعة وحده.', educationalNoteEn: 'Pattern and distribution guide diagnosis more than spot color alone.', symptomIds: ['sy-spots'], cropIds: ['crop-onion', 'crop-grapes'], relatedCategoryIds: ['cat-fungicides'], relatedArticleIds: ['art-leaf-spots'] },
  { id: 'pr-wilt', slug: 'wilting', nameAr: 'ذبول', nameEn: 'Wilting', descriptionAr: 'قد ينتج عن عطش أو أعفان أو نيماتودا أو حرارة الظهيرة.', descriptionEn: 'May result from drought, rot, nematodes, or midday heat.', educationalNoteAr: 'افحص الجذور والرطوبة قبل الرش.', educationalNoteEn: 'Inspect roots and soil moisture before spraying.', symptomIds: ['sy-wilt'], cropIds: ['crop-cucumber', 'crop-pepper', 'crop-potato'], relatedCategoryIds: ['cat-nematicides', 'cat-fungicides'], relatedArticleIds: ['art-root-health'] },
  { id: 'pr-insects', slug: 'chewing-insects', nameAr: 'حشرات قارضة', nameEn: 'Chewing insects', descriptionAr: 'ثقوب وقرض على الأوراق والثمار.', descriptionEn: 'Holes and chewing damage on leaves and fruit.', educationalNoteAr: 'حدد الحشرة قبل اختيار مجموعة المبيد.', educationalNoteEn: 'Identify the insect before choosing an insecticide group.', symptomIds: ['sy-insects'], cropIds: ['crop-grapes', 'crop-tomato'], relatedCategoryIds: ['cat-insecticides'], relatedArticleIds: ['art-spray-coverage'] },
];

export const PROBLEMS: PlantProblem[] = PROBLEM_ROWS.map((p) => {
  const image = `/assets/images/problems/${p.slug}.webp`;
  return {
    ...p,
    image,
    thumbnail: image,
    imageAltAr: p.nameAr,
    imageAltEn: p.nameEn,
  };
});

export const SYMPTOM_VISUALS: SymptomVisual[] = SYMPTOMS.flatMap((symptom) =>
  CROPS.slice(0, 3).map((crop) => ({
    cropId: crop.id,
    symptomId: symptom.id,
    problemCategory: PROBLEMS.find((p) => p.symptomIds.includes(symptom.id))?.relatedCategoryIds[0] ?? 'cat-fungicides',
    image: symptom.image,
    imageAltAr: `${symptom.nameAr} — ${crop.nameAr}`,
    imageAltEn: `${symptom.nameEn} — ${crop.nameEn}`,
  })),
);

export const CLARIFYING_QUESTIONS: ClarifyingQuestion[] = [
  {
    id: 'q-leaf-age',
    questionAr: 'هل العرض ظاهر على الأوراق القديمة أم الحديثة؟',
    questionEn: 'Is the symptom on old or new leaves?',
    options: [
      { id: 'old', labelAr: 'أوراق قديمة', labelEn: 'Old leaves' },
      { id: 'new', labelAr: 'أوراق حديثة', labelEn: 'New leaves' },
      { id: 'both', labelAr: 'الاثنان معًا', labelEn: 'Both' },
    ],
  },
  {
    id: 'q-spreading',
    questionAr: 'هل المشكلة في انتشار سريع؟',
    questionEn: 'Is the problem spreading quickly?',
    options: [
      { id: 'yes', labelAr: 'نعم', labelEn: 'Yes' },
      { id: 'no', labelAr: 'لا', labelEn: 'No' },
      { id: 'unsure', labelAr: 'غير متأكد', labelEn: 'Not sure' },
    ],
  },
  {
    id: 'q-saline-water',
    questionAr: 'هل مياه الري مالحة أو مرتفعة التوصيل الكهربائي؟',
    questionEn: 'Is the irrigation water saline or high in EC?',
    options: [
      { id: 'yes', labelAr: 'نعم', labelEn: 'Yes' },
      { id: 'no', labelAr: 'لا', labelEn: 'No' },
      { id: 'unknown', labelAr: 'لا أعرف', labelEn: 'Unknown' },
    ],
  },
  {
    id: 'q-visible-insects',
    questionAr: 'هل تظهر حشرات بالعين المجردة؟',
    questionEn: 'Are insects visible to the naked eye?',
    options: [
      { id: 'yes', labelAr: 'نعم', labelEn: 'Yes' },
      { id: 'no', labelAr: 'لا', labelEn: 'No' },
    ],
  },
  {
    id: 'q-recent-spray',
    questionAr: 'هل تم رش مبيد مؤخرًا؟',
    questionEn: 'Was a pesticide applied recently?',
    options: [
      { id: 'yes', labelAr: 'نعم خلال أسبوع', labelEn: 'Yes, within a week' },
      { id: 'no', labelAr: 'لا', labelEn: 'No' },
    ],
  },
];
