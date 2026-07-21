import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeormConfig } from "src/common/config/typeorm.config";
import { ProductModule } from "@/modules/product/product.module";
import { DiscountModule } from "../discount/discount.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeormConfig()),
    ProductModule,
    DiscountModule,
  ],
})
export class AppModule {}
