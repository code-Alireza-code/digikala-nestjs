import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { CartService } from "./cart.service";
import { StandardFormType } from "@/common/decorators/formType.decorator";
import { AddToCartDto } from "./dtos/cartProduct.dto";
import { AddDiscountToCartDto } from "./dtos/dicount.dto";

@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Get()
  getCart() {
    return this.cartService.getCart();
  }
  @Post("/add")
  @StandardFormType()
  addToCart(@Body() cartDto: AddToCartDto) {
    return this.cartService.addProductToCart(cartDto);
  }
  @Post("/add-discount")
  @StandardFormType()
  async addDiscountToCart(@Body() discountDto: AddDiscountToCartDto) {
    return this.cartService.addDiscountToCart(discountDto);
  }
  @Delete("/remove-discount")
  @StandardFormType()
  async removeDiscountFromCart(@Body() discountDto: AddDiscountToCartDto) {
    return this.cartService.removeDiscountFromCart(discountDto);
  }
  @Delete("/:productId")
  removeFromCart(@Param("productId", ParseIntPipe) id: number) {
    return this.cartService.removeProductFromCart(id);
  }
}
