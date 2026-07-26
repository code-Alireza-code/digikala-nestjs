import { BaseEntity } from "@/common/abstract/base.entity";
import { EntityNames } from "@/common/enum/entity-name.enum";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { ProductEntity } from "./product.entity";
import { CartEntity } from "@/modules/cart/entities/cart.entity";
import { OrderItemsEntity } from "@/modules/order/entites/order-items.entity";

@Entity(EntityNames.ProductSize)
export class ProductSizeEntity extends BaseEntity {
  @Column()
  productId: number;
  @Column()
  size: string;
  @Column()
  count: number;
  @Column({ type: "decimal" })
  price: number;
  @Column({ type: "decimal", default: 0 })
  discount: number;
  @Column({ default: false })
  active_discount: boolean;
  @ManyToOne(() => ProductEntity, (product) => product.sizes, {
    onDelete: "CASCADE",
  })
  product: ProductEntity;
  @OneToMany(() => CartEntity, (cart) => cart.size)
  carts: CartEntity[];
  @OneToMany(() => OrderItemsEntity, (order) => order.size)
  orders: OrderItemsEntity[];
}
