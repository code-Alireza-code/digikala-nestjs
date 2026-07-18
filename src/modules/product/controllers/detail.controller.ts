import { Controller } from "@nestjs/common";
import { ProductDetailService } from "../service/product-detail.service";

@Controller("product-detail")
export class ProductDetailController {
  constructor(private readonly productDetailService: ProductDetailService) {}
}
