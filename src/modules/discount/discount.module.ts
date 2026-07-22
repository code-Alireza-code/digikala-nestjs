import { Module } from "@nestjs/common";
import { DiscountService } from "./discount.service";
import { DiscountController } from "./discount.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DiscountEntity } from "./entities/discount.entity";
import { ProductService } from "../product/service/product.service";
import { ProductEntity } from "../product/entities/product.entity";

@Module({
  imports: [TypeOrmModule.forFeature([DiscountEntity, ProductEntity])],
  controllers: [DiscountController],
  providers: [DiscountService, ProductService],
})
export class DiscountModule {}
