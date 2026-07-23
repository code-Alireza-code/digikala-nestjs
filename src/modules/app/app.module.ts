import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeormConfig } from "src/common/config/typeorm.config";
import { ProductModule } from "@/modules/product/product.module";
import { DiscountModule } from "../discount/discount.module";
import { CartModule } from "../cart/cart.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeormConfig()),
    ProductModule,
    DiscountModule,
    CartModule,
  ],
})
export class AppModule {}
