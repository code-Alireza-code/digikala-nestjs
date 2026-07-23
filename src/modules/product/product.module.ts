import { Module } from "@nestjs/common";
import { ProductController } from "./controllers/product.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "./entities/product.entity";
import { ProductColorController } from "./controllers/color.controller";
import { ProductColorEntity } from "./entities/product-color.entity";
import { ProductDetailEntity } from "./entities/product-detail.entity";
import { ProductSizeEntity } from "./entities/product-size.entity";
import { ProductDetailController } from "./controllers/detail.controller";
import { ProductSizeController } from "./controllers/size.controller";
import { ProductService } from "./service/product.service";
import { ProductColorService } from "./service/product-color.service";
import { ProductDetailService } from "./service/product-detail.service";
import { ProductSizeService } from "./service/product-size.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductColorEntity,
      ProductDetailEntity,
      ProductSizeEntity,
    ]),
  ],
  controllers: [
    ProductController,
    ProductColorController,
    ProductDetailController,
    ProductSizeController,
  ],
  providers: [
    ProductService,
    ProductColorService,
    ProductDetailService,
    ProductSizeService,
  ],
  exports: [
    ProductService,
    ProductColorService,
    ProductDetailService,
    ProductSizeService,
    TypeOrmModule,
  ],
})
export class ProductModule {}
