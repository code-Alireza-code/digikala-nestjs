import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentEntity } from "./entities/payment.entity";
import { CartEntity } from "../cart/entities/cart.entity";
import { CartService } from "../cart/cart.service";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { ProductModule } from "../product/product.module";
import { DiscountModule } from "../discount/discount.module";
import { HttpApiModule } from "../http/http.module";
import { OrderEntity } from "../order/entites/order.entity";
import { OrderItemsEntity } from "../order/entites/order-items.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentEntity,
      CartEntity,
      OrderEntity,
      OrderItemsEntity,
    ]),
    ProductModule,
    DiscountModule,
    HttpApiModule,
  ],
  controllers: [PaymentController],
  providers: [CartService, PaymentService],
})
export class PaymentModule {}
