import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "./entites/order.entity";
import { OrderItemsEntity } from "./entites/order-items.entity";

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderItemsEntity])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
