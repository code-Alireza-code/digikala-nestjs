import { Module } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartEntity } from "./entities/cart.entitiy";

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
