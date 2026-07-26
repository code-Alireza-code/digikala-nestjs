import { Column, Entity, OneToOne } from "typeorm";
import { EntityNames } from "@/common/enum/entity-name.enum";
import { BaseWithCreateDateEntity } from "@/common/abstract/base.entity";
import { OrderEntity } from "@/modules/order/entites/order.entity";

@Entity(EntityNames.Payment)
export class PaymentEntity extends BaseWithCreateDateEntity {
  @Column()
  amount: number;
  @Column({ default: false })
  status: boolean;
  @Column({ unique: true })
  invoice_number: string;
  @Column({ nullable: true })
  refId: string;
  @Column({ nullable: true })
  authority: string;
  @Column({ nullable: true })
  orderId: number;
  @OneToOne(() => OrderEntity, (order) => order.payment, {
    onDelete: "CASCADE",
  })
  order: OrderEntity;
}
