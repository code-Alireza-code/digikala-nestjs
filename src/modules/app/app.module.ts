import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeormConfig } from "src/common/config/typeorm.config";
import { ProductModule } from "@/modules/product/product.module";
import { DiscountModule } from "../discount/discount.module";
import { CartModule } from "../cart/cart.module";
import { OrderModule } from "../order/order.module";
import { PaymentModule } from "../payment/payment.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeormConfig()),
    ProductModule,
    DiscountModule,
    CartModule,
    OrderModule,
    PaymentModule,
  ],
})
export class AppModule {}
