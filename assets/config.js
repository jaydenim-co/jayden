window.JAYDEN = {
  instagram: 'https://ig.me/m/jaydenim.co',
  instagramMen: 'https://ig.me/m/jayden.formen',
  whatsapp: 'https://wa.me/message/VYR44CUOAEWGH1',
  deal: { end: '2026-11-30T09:25:00+04:00', min: 25000000 },
  sections: [
    { id: 'deal', fa: 'تا ۷۰٪ تخفیف', en: 'UP TO 70% OFF' },
    { id: 'women', img: 'img/ui/sec-women.webp', ban: 'img/ui/ban-women', fa: 'زنانه', en: 'WOMEN' },
    { id: 'men', img: 'img/ui/sec-men.webp', ban: 'img/ui/ban-men', fa: 'مردانه', en: 'MEN' },
    { id: 'kids', img: 'img/ui/sec-kids.webp', ban: 'img/ui/ban-kids', fa: 'بچگانه', en: 'KIDS' },
    { id: 'beauty', img: 'img/ui/sec-beauty.webp', ban: 'img/ui/ban-beauty', fa: 'آرایشی', en: 'BEAUTY' },
    { id: 'watch', img: 'img/ui/sec-watch.webp', ban: 'img/ui/ban-watch', fa: 'ساعت', en: 'WATCHES' },
    { id: 'lux', img: 'img/ui/sec-lux.webp', fa: 'لوکس', en: 'LUXURY' }
  ],
  brands: [
    { slug: 'deal70', secs: ['deal'], deal: true, name: 'UP TO 70% OFF', sub: 'محصولات با ۶۵ تا ۷۰٪ تخفیف و بیشتر' },
    { slug: 'sunglasses', secs: ['lux'], lsub: ['glasses'], name: 'LUXURY SUNGLASSES', badge: 'PREMIUM', font: 'bf-lux', sub: 'عینک آفتابی برندهای لوکس', subs: { women: 'عینک آفتابی زنانه از برندهای لوکس: Saint Laurent، Gucci، Prada، Miu Miu، Dior…', men: 'عینک آفتابی مردانه از برندهای لوکس: Tom Ford، Gucci، Saint Laurent، Prada، Cartier…' }, fa: 'عینک آفتابی لوکس', feat: ['img/sunglasses/SG-001.webp', 'img/sunglasses/SG-087.webp', 'img/sunglasses/SG-005.webp', 'img/sunglasses/SG-076.webp'], line: 'Saint Laurent · Dior · Gucci · Prada · Miu Miu · Tom Ford', note: 'کالکشن پریمیوم · عینک‌های اورجینال از معتبرترین برندهای لوکس دنیا' },
    { slug: 'nike', secs: ['women', 'men'], group: { women: 'w', men: 'm' }, name: 'NIKE', szu: 'EU', sub: 'کفش و لباس اورجینال Nike · حراج تا ۵۰٪', subs: { women: 'کفش و لباس زنانه Nike', men: 'کفش و لباس مردانه Nike' }, promo: '۲۵٪ تخفیف اضافه روی مدل‌های منتخب (نوار قرمز روی عکس) برای سفارش بالای ۴۸٬۶۹۰٬۰۰۰ تومان', promoMin: 48690000 },
    { slug: 'ecco', secs: ['women', 'men'], group: { women: 'w', men: 'm' }, name: 'ECCO', sub: 'کفش اورجینال ECCO · حراج + ۲۰٪ تخفیف بیشتر با خرید هر ۲ جفت (مدل‌ها دلخواه)', subs: { women: 'کفش زنانه ECCO · خرید هر ۲ جفت ECCO (مدل دلخواه) = ۲۰٪ تخفیف بیشتر', men: 'کفش مردانه ECCO · خرید هر ۲ جفت ECCO (مدل دلخواه) = ۲۰٪ تخفیف بیشتر' } },
    { slug: 'coach', secs: ['women', 'men'], group: { women: 'w', men: 'm' }, name: 'COACH', sub: 'کیف، کفش، لباس و اکسسوری · قیمت با ۲۰٪ تخفیف اضافه Black Friday', font: 'bf-coach' },
    { slug: 'jwpei', secs: ['women'], name: 'JW PEI', sub: 'کیف و کفش', font: 'bf-jwpei' },
    { slug: 'emporioarmani', secs: ['women'], name: 'EMPORIO ARMANI', sub: 'کیف‌های MyEA' },
    { slug: 'toryburch', secs: ['women'], name: 'TORY BURCH', sub: 'کیف، کفش، ساعت و جواهرات · قیمت ویژه Black Friday' },
    { slug: 'karllagerfeld', secs: ['women'], name: 'KARL LAGERFELD', sub: 'کیف، کفش زنانه و کاپشن', font: 'bf-karl' },
    { slug: 'calvinklein', secs: ['women', 'men'], group: { women: 'w', men: 'm' }, name: 'CALVIN KLEIN', sub: 'کاپشن، کیف، کفش، شلوار، سویشرت و پولوشرت', subs: { women: 'کاپشن، کیف، کفش، جین و سویشرت زنانه', men: 'کاپشن، کیف، کفش، جین، سویشرت و پولوشرت مردانه' }, font: 'bf-ck' },
    { slug: 'ralphlauren', secs: ['women', 'men'], group: { women: 'w', men: 'm' }, name: 'RALPH LAUREN', sub: 'پوشاک، کفش، کیف و کمربند', subs: { women: 'کاپشن، بافت، بلوز، شلوار، کفش و کیف زنانه', men: 'کاپشن، بافت، پولوشرت، پیراهن، شلوار و کفش مردانه' }, font: 'bf-rl' },
    { slug: 'gymshark', secs: ['women', 'men'], group: { women: 'w', men: 'm' }, name: 'GYMSHARK', sub: 'لباس ورزشی زنانه و مردانه', subs: { women: 'لباس ورزشی زنانه', men: 'لباس ورزشی مردانه' }, font: 'bf-gym' },
    { slug: 'michaelkors', secs: ['women', 'men'], group: { women: 'w', men: 'm' }, name: 'MICHAEL KORS', sub: 'کیف، کفش، لباس و ساعت', subs: { women: 'کیف، کفش، لباس و ساعت زنانه', men: 'کیف، کفش، لباس و ساعت مردانه' }, font: 'bf-mk' },
    { slug: 'lululemon', secs: ['women', 'men'], group: { women: 'w', men: 'm' }, name: 'lululemon', sub: 'لباس ورزشی زنانه و مردانه', subs: { women: 'لباس ورزشی زنانه', men: 'لباس ورزشی مردانه' }, font: 'bf-lulu' },
    { slug: 'on', secs: ['women', 'men'], group: { women: 'w', men: 'm' }, name: 'On', sub: 'کفش و لباس ورزشی', subs: { women: 'کفش رانینگ و لباس ورزشی زنانه', men: 'کفش رانینگ و لباس ورزشی مردانه' }, font: 'bf-on' },
    { slug: 'veja', secs: ['women', 'men'], group: { women: 'w', men: 'm' }, name: 'VEJA', sub: 'اسنیکر و صندل زنانه و مردانه', subs: { women: 'اسنیکر زنانه', men: 'اسنیکر و صندل مردانه' }, font: 'bf-veja' },
    { slug: 'sephora', secs: ['beauty'], name: 'SEPHORA', sub: 'آرایشی، مراقبت پوست، عطر و مو', font: 'bf-sephora' },
    { slug: 'dyson', secs: ['beauty'], name: 'DYSON', sub: 'ایرپ (Airwrap) و اتو مو (Airstrait)', font: 'bf-dyson' },
    { slug: 'strollers', secs: ['kids'], ksub: ['baby'], name: 'کالسکه و کریر', sub: 'سیستم سفری، کالسکه، کریر و آغوشی نوزاد · Cybex · Bugaboo · UPPAbaby · Inglesina' },
    { slug: 'avent', secs: ['kids'], ksub: ['baby'], name: 'شیشه شیر و لوازم تغذیه', sub: 'شیشه شیر، پستانک، ست هدیه، استریل، گرم‌کن و غذاساز · Philips Avent' },
    { slug: 'momcozy', secs: ['kids'], ksub: ['baby'], name: 'لوازم مادر و نوزاد', sub: 'Momcozy · شیردوش، گرم‌کن، بالش بارداری، آغوشی و لوازم مادر و نوزاد' },
    { slug: 'gap', secs: ['women', 'men', 'kids'], group: { women: 'w', men: 'm' }, ksub: ['baby', 'girl', 'boy'], kgroup: { baby: 'b', girl: 'g', boy: 'k' }, name: 'GAP', sub: 'پوشاک زنانه، مردانه و بچگانه · حراج تا ۵۰٪', subs: { women: 'هودی، کاپشن، تی‌شرت و جین زنانه', men: 'هودی، کاپشن، تی‌شرت و جین مردانه', kids: 'لباس نوزاد، دخترانه و پسرانه' } },
    { slug: 'next', secs: ['kids'], ksub: ['baby', 'girl', 'boy'], kgroup: { baby: 'b', girl: 'g', boy: 'k' }, name: 'لباس و پوشاک · NEXT', sub: 'لباس نوزاد، دخترانه و پسرانه' },
    { slug: 'flikflak', secs: ['kids', 'watch'], ksub: ['girl', 'boy'], kgroup: { girl: 'g', boy: 'k' }, name: 'SWATCH', tag: 'Flik Flak · Swiss Made', sub: 'ساعت بچگانه سوئیسی · مدل‌های قابل حک اسم روی بند' },
    { slug: 'shavers', secs: ['beauty', 'men'], group: { men: 'm' }, dmMen: true, name: 'SHAVERS', sub: 'ریش‌تراش و ماشین اصلاح · Philips · Braun · Panasonic · Wahl', subs: { men: 'ریش‌تراش، ماشین اصلاح و بادی گرومر · Philips · Braun · Panasonic', beauty: 'ریش‌تراش مردانه و بانوان · Philips · Braun · Panasonic · Wahl' } },
    { slug: 'esteelauder', secs: ['beauty'], name: 'ESTÉE LAUDER', sub: 'مراقبت پوست، آرایشی، عطر و ست هدیه', font: 'bf-el' },
    { slug: 'luxwatch', secs: ['lux'], lsub: ['watch'], name: 'LUXURY WATCHES', badge: 'PREMIUM', font: 'bf-lux', tag: 'Gucci · Versace · Philipp Plein · Roberto Cavalli · Tissot …', sub: 'ساعت‌های نو و اورجینال زنانه و مردانه برندهای لوکس', sticky: 'امکان تخفیف اکسترا روی بعضی مدل‌ها وجود دارد · برای استعلام تخفیف پیام بدهید' },
    { slug: 'moonswatch', secs: ['watch'], name: 'OMEGA × SWATCH', tag: 'MoonSwatch · Bioceramic · Swiss Made', sub: 'ساعت MoonSwatch اورجینال و بند' },
    { slug: 'blancpain', secs: ['watch'], name: 'BLANCPAIN × SWATCH', tag: 'Scuba Fifty Fathoms · Swiss Made', sub: 'ساعت غواصی اتوماتیک Scuba Fifty Fathoms' },
    { slug: 'clarins', secs: ['beauty'], name: 'CLARINS', sub: 'مراقبت پوست صورت و بدن، ست هدیه و اسپری مراقبتی' },
  ]
};

window.jaydenCDp = function () {
  var end = new Date((window.JAYDEN.deal || {}).end || Date.now()).getTime(), now = Date.now();
  while (end <= now) end += 864e5;
  var t = Math.floor((end - now) / 1000); return [Math.floor(t / 3600), Math.floor(t % 3600 / 60), t % 60];
};
window.jaydenCD = function () {
  var FA = '۰۱۲۳۴۵۶۷۸۹', end = new Date((window.JAYDEN.deal || {}).end || Date.now()).getTime(), now = Date.now();
  while (end <= now) end += 864e5;
  var t = Math.floor((end - now) / 1000), h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), sc = t % 60;
  var p = function (n) { return (n < 10 ? '0' : '') + n; };
  return ('\u2066' + p(h) + ':' + p(m) + ':' + p(sc) + '\u2069').replace(/\d/g, function (d) { return FA[d]; });
};
