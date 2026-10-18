export type Category = 'Women' | 'Men' | 'Objects'

export type Product = {
  slug: string
  name: string
  category: Category
  edition: string
  price: number
  badge?: string
  summary: string
  description: string
  details: string[]
  sizes: string[]
  image: string
  imageAlt: string
}

export type BagLine = {
  slug: string
  size: string
  quantity: number
}

export type ResolvedLine = BagLine & {
  name: string
  category: Category
  unitPrice: number
  lineTotal: number
  image: string
  imageAlt: string
}

export const categories: Array<Category | 'All'> = ['All', 'Women', 'Men', 'Objects']

export const products: Product[] = [
  {
    slug: 'grid-blazer',
    name: 'The Grid Blazer',
    category: 'Women',
    edition: 'Precision wool · SS26',
    price: 42000,
    badge: 'Just in',
    summary: 'A squared shoulder and a clean city-block line.',
    description:
      'Half-canvassed wool with a sharp shoulder and a single button. It is cut to wear open over a knit, or closed once the streetlights come on.',
    details: ['Italian wool blend', 'Half canvas', 'Corozo button', 'Dry clean'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image: '/products/grid-blazer.jpg',
    imageAlt: 'Black wool blazer with a gold rim light',
  },
  {
    slug: 'after-hours-suit',
    name: 'After Hours Suit',
    category: 'Men',
    edition: 'Night wool · two piece',
    price: 89000,
    badge: 'Flagship',
    summary: 'A dark suit that reads as one continuous line.',
    description:
      'Jacket and trouser in a matte night wool. The lapel is narrow, the trouser is straight, and the cloth takes light the way wet pavement does.',
    details: ['Two-piece suit', 'Unstructured shoulder', 'Horn buttons', 'Dry clean'],
    sizes: ['36', '38', '40', '42', '44'],
    image: '/products/after-hours-suit.jpg',
    imageAlt: 'Man in a matte black suit',
  },
  {
    slug: 'city-light-trench',
    name: 'City Light Trench',
    category: 'Women',
    edition: 'Water-repellent cotton',
    price: 69000,
    summary: 'A trench with a longer, quieter line.',
    description:
      'Cotton gabardine that sheds weather without shining. The belt is optional. The length is meant to clear a curb.',
    details: ['Cotton gabardine', 'Removable belt', 'Horn buttons', 'Water-repellent'],
    sizes: ['XS', 'S', 'M', 'L'],
    image: '/products/city-light-trench.jpg',
    imageAlt: 'Long black trench on a night street',
  },
  {
    slug: 'gold-line-loafer',
    name: 'Gold Line Loafer',
    category: 'Objects',
    edition: 'Leather · metal thread',
    price: 34000,
    summary: 'A black loafer finished with a single gold seam.',
    description:
      'Calf leather with a low heel and a gold seam that catches the light when you walk. Made to live with the suits and the dresses, not beside them.',
    details: ['Calf leather', 'Leather sole', 'Gold seam', 'Made in small runs'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    image: '/products/gold-line-loafer.jpg',
    imageAlt: 'Black leather loafer with a gold seam',
  },
  {
    slug: 'skyline-overcoat',
    name: 'Skyline Overcoat',
    category: 'Men',
    edition: 'Double-face wool',
    price: 74000,
    summary: 'A long coat with the weight of a building line.',
    description:
      'Double-face wool, no lining to speak of, and a collar that stands when the wind does. It is the piece the rest of the wardrobe disappears under.',
    details: ['Double-face wool', 'Unlined', 'Horn buttons', 'Dry clean'],
    sizes: ['S', 'M', 'L', 'XL'],
    image: '/products/skyline-overcoat.jpg',
    imageAlt: 'Long black wool overcoat',
  },
  {
    slug: 'midnight-column',
    name: 'Midnight Column',
    category: 'Women',
    edition: 'Silk crepe · limited',
    price: 52000,
    badge: 'Limited',
    summary: 'A column dress that holds its own after dark.',
    description:
      'Silk crepe with a narrow skirt and a neckline that stays quiet. It moves when you do, and it stops when you stop.',
    details: ['Silk crepe', 'Side zip', 'Lined bodice', 'Dry clean'],
    sizes: ['0', '2', '4', '6', '8', '10'],
    image: '/products/midnight-column.jpg',
    imageAlt: 'Black silk column dress',
  },
  {
    slug: 'signal-knit',
    name: 'Signal Knit',
    category: 'Men',
    edition: 'Recycled merino',
    price: 26000,
    summary: 'A fine merino with a clean neckline.',
    description:
      'Light enough for a heated room, substantial enough for the walk between them. The neck sits cleanly under a jacket.',
    details: ['Recycled merino', 'Clean neck', 'Ribbed hem', 'Hand wash cold'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image: '/products/signal-knit.jpg',
    imageAlt: 'Black merino knit with a gold rim light',
  },
  {
    slug: 'night-market-shirt',
    name: 'Night Market Shirt',
    category: 'Men',
    edition: 'Washed cotton',
    price: 18000,
    summary: 'A black shirt with a softer collar and a longer cuff.',
    description:
      'Washed cotton that already looks lived in. Wear it open at the neck with the suit, or alone when the jacket stays on the chair.',
    details: ['Washed cotton', 'Mother-of-pearl buttons', 'Longer cuff', 'Machine wash cold'],
    sizes: ['S', 'M', 'L', 'XL'],
    image: '/products/night-market-shirt.jpg',
    imageAlt: 'Black washed cotton shirt',
  },
  {
    slug: 'atelier-scarf',
    name: 'Atelier Scarf',
    category: 'Objects',
    edition: 'Wool cashmere · gold edge',
    price: 16000,
    summary: 'A black scarf with a narrow gold edge.',
    description:
      'Wool and cashmere, cut long, with a gold edge that shows only when it moves. One of the objects we keep by the door of the flagship.',
    details: ['Wool cashmere', 'Gold edge', 'Fringe-free', 'Dry clean'],
    sizes: ['One size'],
    image: '/products/atelier-scarf.jpg',
    imageAlt: 'Black scarf with a gold edge',
  },
]

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug)
}

export function relatedProducts(slug: string) {
  const current = getProduct(slug)
  const others = products.filter((product) => product.slug !== slug)
  const same = others.filter((product) => product.category === current?.category)
  const rest = others.filter((product) => product.category !== current?.category)
  return [...same, ...rest].slice(0, 3)
}

export function formatMoney(cents: number) {
  const hasCents = cents % 100 !== 0
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(cents / 100)
}

export function resolveLines(items: BagLine[]): ResolvedLine[] {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Your bag is empty.')
  }
  if (items.length > 20) {
    throw new Error('This bag has too many lines.')
  }

  return items.map((item) => {
    const product = getProduct(item.slug)
    if (!product) throw new Error('A piece in your bag is no longer available.')
    if (!product.sizes.includes(item.size)) throw new Error(`Choose a size for ${product.name}.`)
    const quantity = Number(item.quantity)
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 8) {
      throw new Error('Quantity must be between 1 and 8.')
    }
    return {
      slug: product.slug,
      name: product.name,
      category: product.category,
      size: item.size,
      quantity,
      unitPrice: product.price,
      lineTotal: product.price * quantity,
      image: product.image,
      imageAlt: product.imageAlt,
    }
  })
}

export function linesTotal(lines: ResolvedLine[]) {
  return lines.reduce((sum, line) => sum + line.lineTotal, 0)
}
