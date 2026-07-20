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
import { ProductDetailService } from "../service/product-detail.service";
import { StandardFormType } from "@/common/decorators/formType.decorator";
import { AddDetailDto, UpdateDetailDto } from "../dtos/detail.dto";
import { ApiOperation } from "@nestjs/swagger";

@Controller("product-detail")
export class ProductDetailController {
  constructor(private readonly productDetailService: ProductDetailService) {}
  @Post()
  @StandardFormType()
  create(@Body() detailDto: AddDetailDto) {
    return this.productDetailService.create(detailDto);
  }
  @Get("/all/:productId")
  @ApiOperation({ summary: "get all of a product's details" })
  findAll(@Param("productId", ParseIntPipe) productId: number) {
    return this.productDetailService.findAll(productId);
  }
  @Get("/:id")
  @ApiOperation({ summary: "get a product detail by id" })
  find(@Param("id", ParseIntPipe) id: number) {
    return this.productDetailService.findOneById(id);
  }
  @Patch("/:id")
  @StandardFormType()
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() detailDto: UpdateDetailDto,
  ) {
    return this.productDetailService.update(id, detailDto);
  }
  @Delete("/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.productDetailService.remove(id);
  }
}
