import { BaseEntity } from "@/common/abstract/base.entity";
import { EntityNames } from "@/common/enum/entity-name.enum";
import { Column, Entity, ManyToOne } from "typeorm";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "@/modules/product/entities/product.entity";
import { ProductColorEntity } from "@/modules/product/entities/product-color.entity";
import { ProductSizeEntity } from "@/modules/product/entities/product-size.entity";

@Entity(EntityNames.OrderItems)
export class OrderItemsEntity extends BaseEntity {
  @Column()
  orderId: number;
  @Column()
  productId: number;
  @Column({ nullable: true })
  colorId: number;
  @Column({ nullable: true })
  sizeId: number;
  @ManyToOne(() => OrderEntity, (order) => order.items)
  order: OrderEntity;
  @ManyToOne(() => ProductEntity, (product) => product.orders)
  product: ProductEntity;
  @ManyToOne(() => ProductColorEntity, (color) => color.orders)
  color: ProductColorEntity;
  @ManyToOne(() => ProductSizeEntity, (size) => size.orders)
  size: ProductSizeEntity;
}
