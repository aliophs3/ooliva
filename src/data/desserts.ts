// ─────────────────────────────────────────────────────────────────────────────
//  DESSERTS — PRODUCT DATA
//  Edit ONLY this array to update products on the page.
//
//  • name         full product name (shown in hero headline and cards)
//  • shortName    short keyword for the giant background text (e.g. "CHOCO", not "Choco Cake")
//  • description  one-line tagline
//  • price        price string  e.g. "$3"
//  • image        null = shows placeholder; replace with "/your-image.png" or URL
//  • themeColor   hex theme color for this product's slide; used when image is null
//                 TIP: once you add a real PNG, extract its dominant color and put it here
// ─────────────────────────────────────────────────────────────────────────────

export interface Dessert {
  name: string
  shortName: string
  description: string
  price: string
  image: string | null
  themeColor: string
}

export const desserts: Dessert[] = [
  {
    name: 'Choco Cake',
    shortName: 'CHOCO',
    description: 'Taste the best chocolate in Lebanon.',
    price: '$3',
    image: 'https://i.imgur.com/57LvFzR.png',
    themeColor: '#5C3220',
  },
  {
    name: 'Strawberry Cake',
    shortName: 'BERRY',
    description: 'Soft vanilla sponge with fresh strawberry cream.',
    price: '$4',
    image: '/strawberry-cake.png',
    themeColor: '#C75B6E',
  },
  {
    name: 'Pistachio Slice',
    shortName: 'PISTACHIO',
    description: 'Buttery layers with roasted pistachio cream.',
    price: '$4.5',
    image: null,
    themeColor: '#9CAE5A',
  },
  {
    name: 'Honey Cake',
    shortName: 'HONEY',
    description: 'Warm honey layers soaked in golden syrup.',
    price: '$3.5',
    image: null,
    themeColor: '#D49A2C',
  },
  {
    name: 'Lotus Cheesecake',
    shortName: 'LOTUS',
    description: 'Creamy cheesecake topped with caramel biscuit crumble.',
    price: '$5',
    image: null,
    themeColor: '#B5763C',
  },
]
