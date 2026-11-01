export const celebrations = [
  { name: 'Weddings', local: 'Shaadi', image: 'photo-1519741497674-611481863552', note: 'A gathering of families, traditions, and forever.' },
  { name: 'Mehendi', local: 'The henna ceremony', image: 'photo-1519225421980-715cb0215aed', note: 'Color, music, and joyful anticipation.' },
  { name: 'Haldi', local: 'A golden morning', image: 'photo-1511795409834-ef04bbd61622', note: 'A sunlit celebration wrapped in ritual.' },
  { name: 'Sangeet', local: 'An evening of music', image: 'photo-1507504031003-b417219a0fde', note: 'A lively night made for dancing together.' },
  { name: 'Baby showers', local: 'Godh Bharai', image: 'photo-1519225421980-715cb0215aed', note: 'A warm welcome for a little one.' },
  { name: 'Birthdays', local: 'Janamdin', image: 'photo-1511795409834-ef04bbd61622', note: 'Milestones celebrated with the people you love.' },
  { name: 'Griha Pravesh', local: 'A new beginning', image: 'photo-1600210492486-724fe5c67fb0', note: 'A thoughtful welcome to a new home.' },
  { name: 'Pooja', local: 'A sacred gathering', image: 'photo-1603006905003-be475563bc59', note: 'An inviting setting for meaningful tradition.' },
  { name: 'Get-togethers', local: 'Time together', image: 'photo-1519167758481-83f550bb49b3', note: 'Intimate gatherings, beautifully considered.' },
  { name: 'Anniversaries', local: 'A love renewed', image: 'photo-1511285560929-80b456fea0bc', note: 'Honoring the story you continue to write.' },
]

export const rentalGroups = [
  { title: 'Seating', items: ['Chiavari chairs', 'Banquet chairs', 'Folding chairs', 'Sofas', 'Loveseats', 'Gaddi / floor mattresses', 'Chowki', 'Jhoola'] },
  { title: 'Tables', items: ['Round tables', 'Banquet tables', 'Buffet tables', 'Cocktail tables', 'Low tables'] },
  { title: 'Linens', items: ['Tablecloths', 'Silk and brocade runners', 'Napkins', 'Chair covers', 'Chair sashes', 'Ceiling and wall drapes'] },
  { title: 'Mandap & stage', items: ['Wedding mandaps', 'Stage setups', 'Sweetheart table setups', 'Pillars', 'Arches', 'Floral backdrops', 'Fabric backdrops', 'Frame backdrops', 'Tents and canopies'] },
  { title: 'Decor', items: ['Torans', 'Diyas', 'Urlis', 'Kalash', 'Fanoos', 'Marigold garlands', 'Rose garlands'] },
  { title: 'Serveware', items: ['Thaal', 'Handi', 'Chafing dishes', 'Plates', 'Glasses', 'Katori'] },
]

export const services = ['Decor and design', 'Wedding mandap', 'Event rentals', 'Stage setup', 'Floral and fabric backdrop', 'Other listed rentals']
export const states = 'AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC'.split(' ')
export const imageUrl = (id, width = 1400) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`

export const imageSrcSet = id => [480, 800, 1200, 1800, 2200].map(width => `${imageUrl(id, width)} ${width}w`).join(', ')
