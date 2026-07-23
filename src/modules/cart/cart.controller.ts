import { Body, Controller, Post } from "@nestjs/common";
import { CartService } from "./cart.service";
import { StandardFormType } from "@/common/decorators/formType.decorator";
import { AddToCartDto } from "./dtos/cartProduct.dto";

@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post("/add")
  @StandardFormType()
  addToCart(@Body() cartDto: AddToCartDto) {
    return this.cartService.addToCart(cartDto);
  }
}
