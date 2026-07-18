import { BaseWithCreateDateEntity } from "@/common/abstract/base.entity";
import { EntityNames } from "@/common/enum/entity-name.enum";
import { Column, Entity, OneToMany } from "typeorm";
import { ProductColorEntity } from "./product-color.entity";
import { ProductDetailEntity } from "./product-detail.entity";
import { ProductSizeEntity } from "./product-size.entity";

@Entity(EntityNames.Product)
export class ProductEntity extends BaseWithCreateDateEntity {
  @Column()
  title: string;
  @Column()
  content: string;
  @Column()
  slug: string;
  @Column()
  code: string;
  @Column({ default: 0 })
  count: number;
  @Column({ type: "decimal", nullable: true })
  price: number;
  @Column({ type: "decimal", nullable: true })
  discount: number;
  @Column({ default: false })
  active_discount: boolean;
  @OneToMany(() => ProductColorEntity, (color) => color.product)
  colors: ProductColorEntity[];
  @OneToMany(() => ProductDetailEntity, (detail) => detail.product)
  details: ProductDetailEntity[];
  @OneToMany(() => ProductSizeEntity, (size) => size.product)
  sizes: ProductSizeEntity[];
}
