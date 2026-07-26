import { BaseWithCreateDateEntity } from "@/common/abstract/base.entity";
import { EntityNames } from "@/common/enum/entity-name.enum";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { OrderStatus } from "../enum/order-status.enum";
import { OrderItemsEntity } from "./order-items.entity";
import { PaymentEntity } from "@/modules/payment/entities/payment.entity";

@Entity(EntityNames.Order)
export class OrderEntity extends BaseWithCreateDateEntity {
  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus;
  @Column()
  address: string;
  @Column()
  amount: number;
  @Column()
  final_amount: number;
  @Column({ nullable: true })
  paymentId: number;
  @Column()
  discount_amount: number;
  @Column()
  total_amount: number;
  @OneToMany(() => OrderItemsEntity, (item) => item.orderId, {
    onDelete: "CASCADE",
  })
  items: OrderItemsEntity[];
  @OneToOne(() => PaymentEntity, (payment) => payment.order, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  payment: PaymentEntity;
}
