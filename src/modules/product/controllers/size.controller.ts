import { Controller } from "@nestjs/common";
import { ProductSizeService } from "../service/product-size.service";

@Controller("product-size")
export class ProductSizeController {
  constructor(private productSizeService: ProductSizeService) {}
}
