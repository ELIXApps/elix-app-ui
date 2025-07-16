
interface IProductOption {
  product: string,
  specification: string,
  unit: string,
  hasMultipleSpecValues?: boolean,
  specificationOptions?: string[]
}

const productOptions: IProductOption[] = [
  { product: 'BANGLE', specification: 'Size', unit: 'Inch' },
  { product: 'BRACELET', specification: 'Size', unit: 'Inch' },
  { product: 'NECKLACE', specification: 'Length', unit: 'Inch' },
  { product: 'PENDANT', specification: 'Size', unit: 'Inch' },
  { product: 'LADIES RING', specification: 'Size', unit: 'No' },
  {
    product: 'STUD',
    specification: 'Screw Type',
    unit: 'Pair',
    hasMultipleSpecValues: true,
    specificationOptions: ['Bombay', 'South']
  },
  { product: 'MOGGAPU', specification: 'Valayam', unit: 'Lock' },
  { product: 'GENTS RING', specification: 'Size', unit: 'No' },
  { product: 'RING', specification: 'Size', unit: 'No' },
  {
    product: 'NOSE PIN',
    specification: 'Screw Type',
    unit: 'Pair',
    hasMultipleSpecValues: true,
    specificationOptions: ['Bombay', 'South']
  },
  { product: 'BACKCHAIN', specification: 'Size', unit: 'Inch' },
  { product: 'KODI', specification: 'Size', unit: 'Inch' },
];


const purityOptions = ['18K', '22K', '24K'];

const goldColors = ["Yellow", "White", "Rose", "Pink", "Red"];

export {
    IProductOption,
    productOptions,
    purityOptions,
    goldColors
}