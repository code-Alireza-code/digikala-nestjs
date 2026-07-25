import { Module } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartEntity } from "./entities/cart.entity";
import { ProductEntity } from "../product/entities/product.entity";
import { ProductModule } from "../product/product.module";
import { DiscountModule } from "../discount/discount.module";
@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity, ProductEntity]),
    ProductModule,
    DiscountModule,
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
