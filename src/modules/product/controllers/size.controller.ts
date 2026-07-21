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
import { ProductSizeService } from "../service/product-size.service";
import { StandardFormType } from "@/common/decorators/formType.decorator";
import { AddSizeDto, UpdateSizeDto } from "../dtos/size.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@Controller("product-size")
export class ProductSizeController {
  constructor(private productSizeService: ProductSizeService) {}
  @Post()
  @StandardFormType()
  create(@Body() sizeDto: AddSizeDto) {
    return this.productSizeService.create(sizeDto);
  }
  @Get("/all/:productId")
  @ApiOperation({ summary: "get all of a product's sizes" })
  findAll(@Param("productId", ParseIntPipe) productId: number) {
    return this.productSizeService.findAll(productId);
  }
  @Get("/:id")
  @ApiOperation({ summary: "get a product detail by id" })
  find(@Param("id", ParseIntPipe) id: number) {
    return this.productSizeService.findOneById(id);
  }
  @Patch("/:id")
  @StandardFormType()
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() detailDto: UpdateSizeDto,
  ) {
    return this.productSizeService.update(id, detailDto);
  }
  @Delete("/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.productSizeService.remove(id);
  }
}
