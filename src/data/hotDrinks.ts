// ─────────────────────────────────────────────────────────────────────────────
//  HOT DRINKS — PAGE BACKGROUND
//  Replace this URL with your own café background photo.
//  One photo is used for every drink; only the tint overlay changes per drink.
// ─────────────────────────────────────────────────────────────────────────────
export const backgroundImage =
  'https://images.pexels.com/photos/683039/pexels-photo-683039.jpeg?auto=compress&cs=tinysrgb&w=1920'

export interface HotDrink {
  name: string
  shortName: string    // short word for the giant background text inside the panel
  description: string
  price: string
  image: string | null // null = placeholder; replace with "/your-image.png" or a URL
  themeColor: string   // hex — used as the blended tint over the background photo
}

// ─────────────────────────────────────────────────────────────────────────────
//  HOT DRINKS — PRODUCT DATA
//  Edit ONLY this array to add, remove or update products.
// ─────────────────────────────────────────────────────────────────────────────
export const hotDrinks: HotDrink[] = [
  {
    name: 'Espresso',
    shortName: 'ESPRESSO',
    description: 'Rich single-origin shot, bold and intensely aromatic.',
    price: '$3',
    image: null,
    themeColor: '#2a1000',
  },
  {
    name: 'Cappuccino',
    shortName: 'CAPPUCCINO',
    description: 'Velvety microfoam over a double espresso shot.',
    price: '$4.5',
    image: null,
    themeColor: '#6b3010',
  },
  {
    name: 'Latte',
    shortName: 'LATTE',
    description: 'Smooth espresso with silky steamed milk.',
    price: '$4.5',
    image: null,
    themeColor: '#7a4820',
  },
  {
    name: 'Turkish Coffee',
    shortName: 'TURKISH',
    description: 'Traditional cardamom-spiced brew, bold and deeply aromatic.',
    price: '$3.5',
    image: null,
    themeColor: '#1c0800',
  },
  {
    name: 'Hot Chocolate',
    shortName: 'CHOCOLATE',
    description: 'Rich dark cocoa with steamed milk and a touch of cream.',
    price: '$5',
    image: null,
    themeColor: '#3b1208',
  },
  {
    name: 'Mint Tea',
    shortName: 'MINT',
    description: 'Fresh garden mint leaves steeped to perfection.',
    price: '$3',
    image: null,
    themeColor: '#0e3018',
  },
]
