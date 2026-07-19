import { Body, Controller, Post } from "@nestjs/common";
import { ProductService } from "../service/product.service";
import { ApiConsumes } from "@nestjs/swagger";
import { FormType } from "@/common/enum/form-type.enum";
import { CreateProductDto } from "../dtos/product.dto";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  create(@Body() productDto: CreateProductDto) {
    return this.productService.create(productDto);
  }
}
