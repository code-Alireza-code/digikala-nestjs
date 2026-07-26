import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentEntity } from "./entities/payment.entity";
import { CartEntity } from "../cart/entities/cart.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity, CartEntity])],
  controllers: [],
  providers: [],
})
export class PaymentModule {}
