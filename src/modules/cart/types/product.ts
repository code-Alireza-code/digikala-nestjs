export type ProductItem = {
  id: number;
  slug: string;
  title: string;
  active_discount: boolean;
  discount: number;
  price: number;
  sizeId?: number;
  size?: string;
  colorId?: number;
  color_name?: string;
  color_code?: string;
};
