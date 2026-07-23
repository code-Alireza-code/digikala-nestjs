import { BaseWithCreateDateEntity } from "@/common/abstract/base.entity";
import { EntityNames } from "@/common/enum/entity-name.enum";
import { DiscountEntity } from "@/modules/discount/entities/discount.entity";
import { ProductColorEntity } from "@/modules/product/entities/product-color.entity";
import { ProductSizeEntity } from "@/modules/product/entities/product-size.entity";
import { ProductEntity } from "@/modules/product/entities/product.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity(EntityNames.Cart)
export class CartEntity extends BaseWithCreateDateEntity {
  @Column({ nullable: true })
  productId: number;
  @Column({ nullable: true })
  sizeId: number;
  @Column({ nullable: true })
  colorId: number;
  @Column({ nullable: true })
  discountId: number;
  @Column()
  count: number;
  @ManyToOne(() => ProductEntity, (product) => product.carts, {
    onDelete: "CASCADE",
  })
  product: ProductEntity;
  @ManyToOne(() => ProductColorEntity, (color) => color.carts, {
    onDelete: "CASCADE",
  })
  color: ProductColorEntity;
  @ManyToOne(() => ProductSizeEntity, (size) => size.carts, {
    onDelete: "CASCADE",
  })
  size: ProductSizeEntity;
  @ManyToOne(() => DiscountEntity, (discount) => discount.carts, {
    onDelete: "CASCADE",
  })
  discount: DiscountEntity;
}
