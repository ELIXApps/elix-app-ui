import { IProductOption } from "./product";

interface IDesign {
  tenant?: string;
  designId?: string;
  colorStoneWeight?: string;
  diamondWeight?: string;
  designNo?: string;
  goldWeight?: string;
  productData?: IProductOption;
  goldColor?: string;
  specValue?: string;
  goldCarat?: string;
}

export {
    IDesign
}