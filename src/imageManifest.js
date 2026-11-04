/**
 * Central registry for editorial photography. Photographs are supplied by
 * Unsplash and used as visual inspiration, not as a record of client events.
 * `sourceSample` records the JPEG sample used during the local image audit;
 * production delivery is still resized by images.unsplash.com.
 */
export const imageManifest = [
  { id: 'reception-tables', image: 'photo-1464366400600-7168b8af9bc3', alt: 'Round reception tables arranged beneath a softly draped ceiling', caption: 'A welcoming reception setting', categories: ['Weddings', 'Event Decor', 'Rental Collections'], assignment: ['Homepage rental card: Tables'], aspectRatio: 1.498, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 801, format: 'JPEG', bytes: 168386 } },
  { id: 'wedding-sign', image: 'photo-1507504031003-b417219a0fde', alt: 'A wooden celebration sign reading Mr and Mrs among leafy branches', caption: 'A personal welcome for the celebration', categories: ['Weddings', 'Event Decor'], assignment: ['Gallery inspiration'], aspectRatio: 1.5, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 800, format: 'JPEG', bytes: 141996 } },
  { id: 'outdoor-couple', image: 'photo-1511285560929-80b456fea0bc', alt: 'A group celebrating outdoors beneath floating balloons', caption: 'A joyful moment shared outdoors', categories: ['Cultural Gatherings & Get-togethers'], assignment: ['Gallery inspiration: Cultural Gatherings'], aspectRatio: 1.498, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 801, format: 'JPEG', bytes: 150267 } },
  { id: 'floral-table-setting', image: 'photo-1511795409834-ef04bbd61622', alt: 'A floral event table set with glassware and candles', caption: 'A table dressed for gathering', categories: ['Rental Collections', 'Event Decor'], assignment: ['Gallery inspiration: Rental Collections'], aspectRatio: 1.498, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 801, format: 'JPEG', bytes: 135846 } },
  { id: 'friends-by-water', image: 'photo-1511988617509-a57c8a288659', alt: 'Friends sharing a lively outdoor gathering beside the water', caption: 'Time together in the open air', categories: ['Cultural Gatherings & Get-togethers'], assignment: ['Gallery inspiration: Cultural Gatherings'], aspectRatio: 1.5, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 800, format: 'JPEG', bytes: 105187 } },
  { id: 'ballroom-tables', image: 'photo-1519167758481-83f550bb49b3', alt: 'A ballroom arranged with round tables and warm lighting', caption: 'A room ready to welcome guests', categories: ['Weddings', 'Sangeet', 'Rental Collections'], assignment: ['Homepage celebration card: Gatherings'], aspectRatio: 1.548, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 775, format: 'JPEG', bytes: 234838 } },
  { id: 'floral-table-row', image: 'photo-1519225421980-715cb0215aed', alt: 'A long dining table with pale linens and floral centerpieces', caption: 'Soft florals and thoughtful table details', categories: ['Rental Collections', 'Event Decor', 'Baby Showers'], assignment: ['Homepage rental card: Linens'], aspectRatio: 1.5, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 800, format: 'JPEG', bytes: 127626 } },
  { id: 'evening-couple', image: 'photo-1519741497674-611481863552', alt: 'A couple standing together in the warm light of a celebration', caption: 'A moment in the evening light', categories: ['Weddings', 'Anniversaries'], assignment: ['Homepage: Hero'], aspectRatio: 1.5, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 800, format: 'JPEG', bytes: 82615 } },
  { id: 'floral-mandap', image: 'photo-1587271636175-90d58cdad458', alt: 'A South Asian couple seated beneath a flower-decorated mandap', caption: 'A ceremony beneath a floral canopy', categories: ['Weddings', 'Mandap & stage'], assignment: ['Homepage celebration card: Weddings'], aspectRatio: 1.5, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 800, format: 'JPEG', bytes: 193780 } },
  { id: 'home-interior', image: 'photo-1600210492486-724fe5c67fb0', alt: 'A calm, light-filled contemporary living room', caption: 'A considered welcome at home', categories: ['Pooja & Traditional Celebrations', 'Griha Pravesh'], assignment: ['Celebration page: Griha Pravesh'], aspectRatio: 1.333, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 900, format: 'JPEG', bytes: 193661 } },
  { id: 'diya-garland', image: 'photo-1630764883659-69ddbac02e40', alt: 'A traditional oil lamp glowing beside marigold garlands', caption: 'A traditional detail in warm light', categories: ['Pooja & Traditional Celebrations', 'Event Decor'], assignment: ['Homepage rental card: Decor'], aspectRatio: 1.499, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 801, format: 'JPEG', bytes: 65198 } },
  { id: 'pooja-thali', image: 'photo-1700765020008-7fd77c847f8a', alt: 'A traditional pooja thali arranged with flowers and ritual offerings', caption: 'A thoughtful ritual arrangement', categories: ['Pooja & Traditional Celebrations', 'Rental Collections'], assignment: ['Homepage: Pooja'], aspectRatio: 1.5, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 800, format: 'JPEG', bytes: 179746 } },
  { id: 'mehendi-hands', image: 'photo-1712061716395-3988a2780592', alt: 'Henna-adorned hands resting on a shoulder at a South Asian wedding', caption: 'Henna details for a Mehendi gathering', categories: ['Mehendi', 'Weddings'], assignment: ['Celebration page: Mehendi'], sourcePage: 'https://unsplash.com/photos/a-man-and-woman-with-their-hands-on-each-other-jm2EV4VTQN8', aspectRatio: 1.5, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 800, format: 'JPEG', bytes: 186649 } },
  { id: 'sangeet-dancer', image: 'photo-1717011969223-0217a302ec6f', alt: 'A dancer in traditional South Asian attire performing at a celebration', caption: 'Music and movement at a celebration', categories: ['Sangeet', 'Cultural Gatherings & Get-togethers'], assignment: ['Homepage celebration card: Sangeet'], aspectRatio: 0.665, objectPosition: '50% 45%', sourceSample: { width: 1200, height: 1805, format: 'JPEG', bytes: 321988 } },
  { id: 'floral-stage', image: 'photo-1745573673583-a51f665ae48e', alt: 'A floral celebration stage framed by warm drapery', caption: 'A stage framed with flowers and fabric', categories: ['Weddings', 'Mehendi', 'Rental Collections'], assignment: ['Homepage rental card: Mandap & stage'], aspectRatio: 1.5, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 800, format: 'JPEG', bytes: 303027 } },
  { id: 'mehendi-stage', image: 'photo-1747041807213-197ed4037279', alt: 'A colorful South Asian celebration stage with flowers and patterned fabric', caption: 'Color and flowers for a Mehendi', categories: ['Mehendi', 'Event Decor'], assignment: ['Homepage celebration card: Mehendi'], aspectRatio: 1.498, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 801, format: 'JPEG', bytes: 348186 } },
  { id: 'haldi-gathering', image: 'photo-1780227103127-399b439cdd4a', alt: 'Guests dressed in yellow celebrating together at a Haldi gathering', caption: 'A sunlit Haldi celebration', categories: ['Haldi', 'Cultural Gatherings & Get-togethers'], assignment: ['Homepage celebration card: Haldi'], aspectRatio: 0.667, objectPosition: '50% 42%', sourceSample: { width: 1200, height: 1800, format: 'JPEG', bytes: 357016 } },
  { id: 'mandap-arch', image: 'photo-1772127822552-ce9ef537bdcf', alt: 'A floral wedding arch with a ceremony aisle and guest seating', caption: 'An open-air ceremony setting', categories: ['Weddings', 'Mandap & stage', 'Rental Collections'], assignment: ['Homepage: Mandap feature'], sourcePage: 'https://unsplash.com/photos/decorated-wedding-arch-with-floral-aisle-and-seating-XGeKyTG6U6A', aspectRatio: 1.538, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 780, format: 'JPEG', bytes: 147172 } },
  { id: 'marigold-swing', image: 'photo-1790808415655-7633deb022d2', alt: 'An outdoor swing decorated with marigold garlands and colorful pillows', caption: 'A festive seat among marigolds', categories: ['Mehendi', 'Rental Collections', 'Event Decor'], assignment: ['Homepage rental card: Seating'], sourcePage: 'https://unsplash.com/photos/decorated-seating-area-with-marigold-garlands-0zSIaIO2UPU', aspectRatio: 0.667, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 1799, format: 'JPEG', bytes: 424345 } },
  { id: 'wedding-page', image: 'photo-1766590864665-7c81f43c3318', alt: 'A South Asian couple seated during their wedding ceremony', caption: 'A ceremony shared with family', categories: ['Weddings'], assignment: ['Celebration page: Weddings'], sourcePage: 'https://unsplash.com/photos/a-bride-and-groom-during-a-traditional-indian-wedding-ceremony-FwBl6KbLq38', aspectRatio: 0.75, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 1600, format: 'JPEG', bytes: 523916 } },
  { id: 'haldi-page', image: 'photo-1771992228979-542c55a34ed4', alt: 'A bride wearing marigold flowers during a Haldi ceremony', caption: 'Marigolds and turmeric for Haldi', categories: ['Haldi'], assignment: ['Celebration page: Haldi'], sourcePage: 'https://unsplash.com/photos/a-bride-adorned-with-marigold-flowers-and-turmeric-paste-S7GMwplf7nI', aspectRatio: 1.5, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 800, format: 'JPEG', bytes: 118679 } },
  { id: 'sangeet-page', image: 'photo-1774437680301-38dded14a9ba', alt: 'People in traditional attire dancing together at a cultural celebration', caption: 'Dance and community at a celebration', categories: ['Sangeet', 'Cultural Gatherings & Get-togethers'], assignment: ['Celebration page: Sangeet'], sourcePage: 'https://unsplash.com/photos/people-in-traditional-indian-attire-dancing-outdoors-gH3bj7jO9mw', aspectRatio: 0.667, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 1800, format: 'JPEG', bytes: 539971 } },
  { id: 'baby-shower-page', image: 'photo-1743437935763-3624f213d02f', alt: 'Soft flowers and candles arranged for a baby shower', caption: 'A gentle welcome for a growing family', categories: ['Baby Showers', 'Event Decor'], assignment: ['Celebration page: Baby Showers'], sourcePage: 'https://unsplash.com/photos/baby-shower-decoration-featuring-flowers-and-candles-iDQQ8RGOe7c', aspectRatio: 0.668, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 1797, format: 'JPEG', bytes: 245057 } },
  { id: 'birthday-page', image: 'photo-1755704282977-340323fa52df', alt: 'A warmly lit birthday celebration decorated with flowers and tables', caption: 'A festive room for a milestone', categories: ['Birthdays', 'Event Decor'], assignment: ['Celebration page: Birthdays'], sourcePage: 'https://unsplash.com/photos/elegant-birthday-party-setup-with-floral-decorations-and-balloons-Vev3io5WxUY', aspectRatio: 0.687, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 1746, format: 'JPEG', bytes: 502510 } },
  { id: 'anniversary-page', image: 'photo-1776078171101-0776fd3a953f', alt: 'A couple celebrating together in traditional attire', caption: 'A story celebrated together', categories: ['Anniversaries', 'Weddings'], assignment: ['Celebration page: Anniversaries'], sourcePage: 'https://unsplash.com/photos/a-couple-in-traditional-indian-attire-vT9Dm3ZlPUI', aspectRatio: 0.667, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 1800, format: 'JPEG', bytes: 265306 } },
  { id: 'pooja-page', image: 'photo-1641296834408-b09a187937d5', alt: 'A marigold flower and lit diya arranged for a traditional observance', caption: 'A diya among marigolds', categories: ['Pooja & Traditional Celebrations', 'Event Decor'], assignment: ['Celebration page: Pooja'], sourcePage: 'https://unsplash.com/photos/a-lit-candle-sitting-next-to-a-bowl-filled-with-flowers-vMC-8nfeIfQ', aspectRatio: 1.5, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 800, format: 'JPEG', bytes: 55135 } },
  { id: 'gathering-page', image: 'photo-1747041807585-f38b14c04704', alt: 'An outdoor celebration space arranged with tables and colorful decor', caption: 'A gathering arranged beneath the open sky', categories: ['Cultural Gatherings & Get-togethers', 'Rental Collections'], assignment: ['Celebration page: Cultural Gatherings'], sourcePage: 'https://unsplash.com/photos/an-outdoor-event-set-up-with-chairs-and-tables-tk2zM8zagcI', aspectRatio: 1.498, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 801, format: 'JPEG', bytes: 325411 } },
  { id: 'seating-page', image: 'photo-1747040762362-87f102f13f28', alt: 'A pair of ornate traditional chairs arranged before a decorated backdrop', caption: 'Traditional seating in a ceremonial setting', categories: ['Rental Collections', 'Weddings'], assignment: ['Rental collection page: Seating'], sourcePage: 'https://unsplash.com/photos/decorated-backdrop-with-two-chairs-for-an-event-pF4yPtSLnTU', aspectRatio: 0.623, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 1927, format: 'JPEG', bytes: 522735 } },
  { id: 'table-page', image: 'photo-1738669469820-259d9c7189bb', alt: 'A table arranged with flowers and a numbered place setting', caption: 'A composed event table', categories: ['Rental Collections', 'Event Decor'], assignment: ['Rental collection page: Tables'], sourcePage: 'https://unsplash.com/photos/a-table-is-set-with-flowers-and-candles-5RfyQ9urdx0', aspectRatio: 0.667, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 1800, format: 'JPEG', bytes: 240617 } },
  { id: 'linen-page', image: 'photo-1758810743028-6b8e150ec98f', alt: 'A softly layered dining table set with pale linens and flowers', caption: 'Soft table linens and floral detail', categories: ['Rental Collections', 'Event Decor'], assignment: ['Rental collection page: Linens'], sourcePage: 'https://unsplash.com/photos/a-beautifully-set-table-with-floral-arrangements-for-an-event-3nj-jsGwjVg', aspectRatio: 1.5, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 800, format: 'JPEG', bytes: 183648 } },
  { id: 'mandap-page', image: 'photo-1744805624954-a6686543c3ff', alt: 'A long outdoor wedding aisle leading to a floral mandap', caption: 'A ceremony canopy at the end of the aisle', categories: ['Weddings', 'Mandap & stage'], assignment: ['Rental collection page: Mandap & stage'], sourcePage: 'https://unsplash.com/photos/a-beautifully-decorated-stage-set-for-a-ceremony-UX3-_dGbCzk', aspectRatio: 0.667, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 1800, format: 'JPEG', bytes: 647125 } },
  { id: 'decor-page', image: 'photo-1739125875360-52013bb8c529', alt: 'Colorful marigold and rose garlands hanging together', caption: 'Flowers gathered for ceremonial details', categories: ['Event Decor', 'Pooja & Traditional Celebrations'], assignment: ['Rental collection page: Decor'], sourcePage: 'https://unsplash.com/photos/a-bunch-of-flowers-that-are-hanging-up-9klBxklLFqU', aspectRatio: 1.404, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 855, format: 'JPEG', bytes: 300635 } },
  { id: 'about-page', image: 'photo-1744804298789-437504006ff8', alt: 'A couple in traditional attire beneath a grove of trees', caption: 'Tradition and personal expression', categories: ['Weddings', 'Cultural Gatherings & Get-togethers'], assignment: ['About page'], sourcePage: 'https://unsplash.com/photos/a-newlyweds-stroll-hand-in-hand-under-floral-garlands-DgxAxa6REoQ', aspectRatio: 0.667, objectPosition: '50% 50%', sourceSample: { width: 1200, height: 1800, format: 'JPEG', bytes: 546830 } },
]

export const imageById = Object.fromEntries(imageManifest.map(asset => [asset.image, asset]))

// SHA-256 hashes of the locally audited 1200px JPEG samples. These hashes make
// exact file duplicates reproducible; the dHash comparison is documented in
// docs/image-audit.md because perceptual hashes are a derived audit value.
export const auditedSampleHashes = {
  'photo-1464366400600-7168b8af9bc3': '358e1b1d8d60e5f7f78141871fe2f7f2d4295c05a21b831409ffacdeece464ad',
  'photo-1507504031003-b417219a0fde': '535302ec0682f4770a32a2595bc48243db062d1a97cd45e070995b1d4fab08ad',
  'photo-1511285560929-80b456fea0bc': 'b2b6aa5cac4bca0220c572923bc56f878f1e182e13feb951930e1e22d3532d4a',
  'photo-1511795409834-ef04bbd61622': '6ad359a0da404ff08da052ac1dec3e58b021a4aebbc5cbe2f4084c0c3a17e1bd',
  'photo-1511988617509-a57c8a288659': 'af46d90bca51e0e271018b570893b989a2c06791ccaa46ca9eaf4561b4ac0021',
  'photo-1519167758481-83f550bb49b3': '79db49c734006012f1c4df7f2d367aa626c639cbba6eda1ac6e6bd77be889562',
  'photo-1519225421980-715cb0215aed': 'c802c7362cb802d6465383993d18694911b76375b8c4b3f524e55c830047a7e9',
  'photo-1519741497674-611481863552': '5deaf5f8b92fb60e6d3cdefc516f478b86121ca0f887c47659918a70d8ef4ac8',
  'photo-1587271636175-90d58cdad458': '9895119f5612c4439add1770f993c5a4aecad8472f92b788d8d3dffe6ada62b4',
  'photo-1600210492486-724fe5c67fb0': '82ce18d583bf9442a8222f2af66f04c073a880fbd7ef980d3ffdcd3143ac0131',
  'photo-1630764883659-69ddbac02e40': '1438177e96d519d999c9c28f19b9341989fc1d0743843539cbb627d52e53c5cd',
  'photo-1700765020008-7fd77c847f8a': 'e96f304e886d85f6c28d37f80cffdd02b92e2a6f4a1d1292bc7fac6e050f0963',
  'photo-1712061716395-3988a2780592': '5e603b29a8a4e360be1b3830f8873f4af2b5497c95161a1b672719696fb71c3a',
  'photo-1717011969223-0217a302ec6f': 'ce822a3de2ea521ac938419221c98976375dbd64bb02e6935e1fd5e877784d12',
  'photo-1745573673583-a51f665ae48e': '703a8d16eeb2a7548cd05a84cd34b755cc22838bfc0cd209650a4c5f1d056ba2',
  'photo-1747041807213-197ed4037279': '05781bc298ebc9b2eb1573f8468157b4b03a21cb240141a6df11312d692e38c2',
  'photo-1780227103127-399b439cdd4a': 'eb4cc1e082e0ba283c8c2ff3dd14a04241274277b3d9b85ca1784826f0a3a101',
  'photo-1772127822552-ce9ef537bdcf': '279f2b12e8018afd20fefa1d0e9b6995bc8bd3b205d559797993b813c2cfcb61',
  'photo-1790808415655-7633deb022d2': '6fa6289c649d8577effbf4a994c39f2c3751d19e056e5114c92e3338869132db',
  'photo-1766590864665-7c81f43c3318': '363f7d53e457688c852b3817c4504f0afc59cb80721d881428a41b78cb76a274',
  'photo-1771992228979-542c55a34ed4': '53de8ba03fd4f7ec8a1186f38f18ff3b32a3ecb4693bb4ade35c93b5138bc01c',
  'photo-1774437680301-38dded14a9ba': '8a806d704e6e6e44cfc572c9f32a0c16635da3716ab458eb968ea5f2db049f6e',
  'photo-1743437935763-3624f213d02f': '313d31a4e0509226c863c9e7ffde8795ee4af8f0e1430f73770d9bde47b336d9',
  'photo-1755704282977-340323fa52df': '9fa3a5bc8dec63729965aa62417fa40879637bec3595590ab01627e42eb17de0',
  'photo-1776078171101-0776fd3a953f': '93bd8d656aae5edd022ff43351906862d25ce95fe4982a72d2ef099176f4e465',
  'photo-1641296834408-b09a187937d5': '15f760b616afb7a1757fcccf1465db82e5fe67189f2d83b6a9f33189da6643af',
  'photo-1747041807585-f38b14c04704': 'b0dd1c074940c231b6a657abacdc3902e8b80645d9ad1a69a0e4761335c8e738',
  'photo-1747040762362-87f102f13f28': '787830ef96296ba8374d91c2715946b4c388fead4646c30c58e0ee7f0db6cb2c',
  'photo-1738669469820-259d9c7189bb': 'a41773dc5876e643f35a87163f504291e51234af11966a27530c2fa44f44cbb0',
  'photo-1758810743028-6b8e150ec98f': 'e64ebb40223bcfb8ac3f36010959b047ce34b94e588d70c9562fa2fbc78b8f22',
  'photo-1744805624954-a6686543c3ff': '00831e54f853e2a1bb80b4535d098f8165e6034274a7450c20425020a132b24b',
  'photo-1739125875360-52013bb8c529': 'd7e3885fe4696bb31d83fd00ca8a41dc2abbd1e6a3efb04b91204833587b9575',
  'photo-1744804298789-437504006ff8': '175071f90bf0f097270dd304eac4c07a52d991c4fefdae089c7cdc39b1ed95f2',
}

export const imageAuditInventory = imageManifest.map(asset => ({
  assetPath: `https://images.unsplash.com/${asset.image}`,
  filename: `${asset.image}.jpg (optimized audit sample)`,
  dimensions: `${asset.sourceSample.width} × ${asset.sourceSample.height}`,
  aspectRatio: asset.aspectRatio,
  format: asset.sourceSample.format,
  sampleFileSizeBytes: asset.sourceSample.bytes,
  sha256Sample: auditedSampleHashes[asset.image],
  usedAt: asset.assignment,
  categories: asset.categories,
  exactDuplicate: false,
  visuallyDuplicate: false,
  suitabilityReviewed: true,
}))

export const galleryCategories = [
  'All', 'Weddings', 'Mehendi', 'Haldi', 'Sangeet', 'Baby Showers',
  'Birthdays', 'Anniversaries', 'Pooja & Traditional Celebrations',
  'Event Decor', 'Rental Collections',
]

// Each unique editorial photograph is represented once in the default view.
// Multiple category tags affect filtering but never create duplicate entries.
export const galleryImages = imageManifest.map(asset => ({
  ...asset,
  category: asset.categories[0],
}))
