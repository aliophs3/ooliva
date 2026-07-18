// ─────────────────────────────────────────────────────────────────────────────
//  COLD DRINKS — PAGE BACKGROUND
//  Replace this URL with your own background photo.
//  One photo is used for every drink; only the tint overlay changes per drink.
// ─────────────────────────────────────────────────────────────────────────────
export const backgroundImage =
  'https://images.pexels.com/photos/3551717/pexels-photo-3551717.jpeg?auto=compress&cs=tinysrgb&w=1920'

export interface ColdDrink {
  name: string
  shortName: string    // short word for the giant background text inside the panel
  description: string
  price: string
  image: string | null // null = placeholder; replace with "/your-image.png" or a URL
  themeColor: string   // hex — used as the blended tint over the background photo
}

// ─────────────────────────────────────────────────────────────────────────────
//  COLD DRINKS — PRODUCT DATA
//  Edit ONLY this array to add, remove or update products.
// ─────────────────────────────────────────────────────────────────────────────
export const coldDrinks: ColdDrink[] = [
  {
    name: 'Iced Vanilla Latte',
    shortName: 'VANILLA',
    description: 'A chilled espresso drink with cold milk and smooth vanilla.',
    price: '$5.49',
    image: null,
    themeColor: '#0d2240',
  },
  {
    name: 'Iced Caramel Latte',
    shortName: 'CARAMEL',
    description: 'Smooth espresso, cold milk, and rich caramel over ice.',
    price: '$5.99',
    image: null,
    themeColor: '#0e1f35',
  },
  {
    name: 'Iced Mocha',
    shortName: 'MOCHA',
    description: 'Espresso, chocolate, and chilled milk poured over ice.',
    price: '$5.79',
    image: null,
    themeColor: '#15102a',
  },
  {
    name: 'Cold Brew',
    shortName: 'BREW',
    description: 'Slow-steeped for 18 hours — bold, smooth, and ice cold.',
    price: '$4.99',
    image: null,
    themeColor: '#08141e',
  },
  {
    name: 'Iced Americano',
    shortName: 'AMERICAN',
    description: 'Double espresso shots over cold water and ice.',
    price: '$4.49',
    image: null,
    themeColor: '#0f1e2e',
  },
  {
    name: 'Matcha Latte',
    shortName: 'MATCHA',
    description: 'Stone-ground matcha whisked with chilled oat milk.',
    price: '$6.49',
    image: null,
    themeColor: '#09261a',
  },
]
