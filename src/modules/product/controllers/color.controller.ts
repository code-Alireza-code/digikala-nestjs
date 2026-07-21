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
import { ProductColorService } from "../service/product-color.service";
import { StandardFormType } from "@/common/decorators/formType.decorator";
import { AddColorDto, UpdateColorDto } from "../dtos/color.dto";
import { ApiOperation } from "@nestjs/swagger";

@Controller("product-color")
export class ProductColorController {
  constructor(private readonly productColorService: ProductColorService) {}
  @Post()
  @StandardFormType()
  create(@Body() colorDto: AddColorDto) {
    return this.productColorService.create(colorDto);
  }
  @Get("/all/:productId")
  @ApiOperation({ summary: "get all of a product's colors" })
  findAll(@Param("productId", ParseIntPipe) productId: number) {
    return this.productColorService.findAll(productId);
  }
  @Get("/:id")
  @ApiOperation({ summary: "get a product color by id" })
  find(@Param("id", ParseIntPipe) id: number) {
    return this.productColorService.findOneById(id);
  }
  @Patch("/:id")
  @StandardFormType()
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() colorDto: UpdateColorDto,
  ) {
    return this.productColorService.update(id, colorDto);
  }
  @Delete("/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.productColorService.remove(id);
  }
}
