import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { ProductService } from "../service/product.service";
import { CreateProductDto, UpdateProductDto } from "../dtos/product.dto";
import { StandardFormType } from "@/common/decorators/formType.decorator";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  @StandardFormType()
  create(@Body() productDto: CreateProductDto) {
    return this.productService.create(productDto);
  }
  @Get()
  findAll() {
    return this.productService.findAll();
  }
  @Get("/:id")
  findOneById(@Param("id", ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }
  @Delete("/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
  @Patch("/:id")
  @StandardFormType()
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() productDto: UpdateProductDto,
  ) {
    return this.productService.update(id, productDto);
  }
}
