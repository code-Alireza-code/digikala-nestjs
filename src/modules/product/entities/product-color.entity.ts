import { BaseEntity } from "@/common/abstract/base.entity";
import { EntityNames } from "@/common/enum/entity-name.enum";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { ProductEntity } from "./product.entity";
import { CartEntity } from "@/modules/cart/entities/cart.entitiy";

@Entity(EntityNames.ProductColor)
export class ProductColorEntity extends BaseEntity {
  @Column()
  productId: number;
  @Column()
  color_name: string;
  @Column()
  color_code: string;
  @Column()
  count: number;
  @Column({ type: "decimal" })
  price: number;
  @Column({ type: "decimal", default: 0 })
  discount: number;
  @Column({ default: false })
  active_discount: boolean;
  @ManyToOne(() => ProductEntity, (product) => product.colors, {
    onDelete: "CASCADE",
  })
  product: ProductEntity;
  @OneToMany(() => CartEntity, (cart) => cart.color)
  carts: CartEntity[];
}
