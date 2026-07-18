import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeormConfig } from "src/common/config/typeorm.config";
import { ProductModule } from "@/modules/product/product.module";

@Module({
  imports: [TypeOrmModule.forRoot(TypeormConfig()), ProductModule],
})
export class AppModule {}
