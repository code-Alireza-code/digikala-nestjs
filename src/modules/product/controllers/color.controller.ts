import { Controller } from "@nestjs/common";
import { ProductColorService } from "../service/product-color.service";

@Controller("product-color")
export class ProductColorController {
  constructor(private readonly productColorService: ProductColorService) {}
}
