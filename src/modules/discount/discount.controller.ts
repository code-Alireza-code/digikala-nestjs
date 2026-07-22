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
import { DiscountService } from "./discount.service";
import { StandardFormType } from "@/common/decorators/formType.decorator";
import {
  CreateDiscountDto,
  GetByCodeDto,
  UpdateDiscountDto,
} from "./dtos/discount.dto";
import { ApiOperation } from "@nestjs/swagger";

@Controller("discount")
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}
  @Post()
  @StandardFormType()
  create(@Body() discountDto: CreateDiscountDto) {
    return this.discountService.create(discountDto);
  }
  @Get()
  findAll() {
    return this.discountService.findAll();
  }
  @Get("/public-discounts")
  @ApiOperation({ summary: "find all public discounts" })
  findAllCartDiscounts() {
    return this.discountService.findAllCartDiscounts();
  }
  @Get("/:id")
  findOneById(@Param("id", ParseIntPipe) id: number) {
    return this.discountService.findOneById(id);
  }
  @Post("/find-by-code")
  @StandardFormType()
  findOneByCode(@Body() { code }: GetByCodeDto) {
    return this.discountService.findOneByCode(code, true);
  }
  @Get("/product/:id")
  @ApiOperation({ summary: "find all discounts of a product" })
  findByProductId(@Param("id", ParseIntPipe) id: number) {
    return this.discountService.findByProductId(id);
  }
  @Patch("/:id")
  @StandardFormType()
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() discountDto: UpdateDiscountDto,
  ) {
    return this.discountService.update(id, discountDto);
  }
  @Delete("/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.discountService.delete(id);
  }
}
