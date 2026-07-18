import { BaseEntity } from "@/common/abstract/base.entity";
import { EntityNames } from "@/common/enum/entity-name.enum";
import { Column, Entity, ManyToOne } from "typeorm";
import { ProductEntity } from "./product.entity";

@Entity(EntityNames.ProductDetail)
export class ProductDetailEntity extends BaseEntity {
  @Column()
  productId: number;
  @Column()
  key: string;
  @Column()
  value: string;
  @ManyToOne(() => ProductEntity, (product) => product.details, {
    onDelete: "CASCADE",
  })
  product: ProductEntity;
}
