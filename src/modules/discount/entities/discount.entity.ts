import { BaseWithCreateDateEntity } from "@/common/abstract/base.entity";
import { EntityNames } from "@/common/enum/entity-name.enum";
import { Column, Entity, OneToMany } from "typeorm";
import { DiscountType } from "../enum/type.enum";
import { CartEntity } from "@/modules/cart/entities/cart.entity";

@Entity(EntityNames.Discount)
export class DiscountEntity extends BaseWithCreateDateEntity {
  @Column({ unique: true })
  code: string;
  @Column({ type: "decimal", nullable: true })
  percent: number;
  @Column({ type: "decimal", nullable: true })
  amount: number;
  @Column({ nullable: true })
  limit: number;
  @Column({ type: "int", default: 0 })
  usage: number;
  @Column({ type: "timestamp", nullable: true })
  expires_in: Date;
  @Column({ nullable: true })
  productId: number;
  @Column({ type: "enum", enum: DiscountType, default: DiscountType.Cart })
  type: string;
  @OneToMany(() => CartEntity, (cart) => cart.discount)
  carts: CartEntity[];
}
