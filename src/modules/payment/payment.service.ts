import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CartService } from "../cart/cart.service";
import { ZarinapalService } from "../http/zarinpal.service";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentEntity } from "./entities/payment.entity";
import { Repository } from "typeorm";
import { OrderEntity } from "../order/entites/order.entity";
import { OrderItemsEntity } from "../order/entites/order-items.entity";
import { OrderStatus } from "../order/enum/order-status.enum";
import { AddressDto } from "./dtos/address.dto";
import { v4 as uuidv4 } from "uuid";
import { VerifyPaymentQuery } from "./types/query";
import { Response } from "express";
import { BadRequestMessage, NotFoundMessage } from "@/common/enum/message.enum";
@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemsEntity)
    private orderItemRepository: Repository<OrderItemsEntity>,
    private cartService: CartService,
    private zarinpalService: ZarinapalService,
  ) {}
  async create(addressDto: AddressDto) {
    const { address } = addressDto;
    const cart = await this.cartService.getCart();
    let order = this.orderRepository.create({
      final_amount: cart.finalAmount,
      total_amount: cart.totalPrice,
      discount_amount: cart.totalDiscountAmount,
      address,
      status: OrderStatus.Pending,
    });

    order = await this.orderRepository.save(order);
    let orderItems = cart.products.map((product) => {
      return {
        orderId: order.id,
        productId: product.id,
        colorId: product?.colorId,
        sizeId: product?.sizeId,
        count: product.count,
      };
    });
    await this.orderItemRepository.insert(orderItems);
    const { authority, gatewayURL } = await this.zarinpalService.sendRequest({
      amount: cart.finalAmount,
      description: "user payment for buying product",
    });
    let payment = await this.paymentRepository.create({
      amount: cart.finalAmount,
      authority,
      orderId: order.id,
      invoice_number: uuidv4(),
      status: false,
    });
    payment = await this.paymentRepository.save(payment);
    order.paymentId = payment.id;
    await this.orderRepository.save(order);
    return { gatewayURL };
  }
  async verify(query: VerifyPaymentQuery) {
    const { Authority: authority, Status: status } = query;
    const payment = await this.paymentRepository.findOneBy({ authority });
    if (!payment) {
      throw new NotFoundException(NotFoundMessage.PaymentNotFound);
    }
    if (payment.status) {
      throw new BadRequestException(BadRequestMessage.PaymentAlreadyVerified);
    }
    if (status === "OK") {
      const order = await this.orderRepository.findOneBy({
        id: payment.orderId,
      });
      if (!order) {
        throw new NotFoundException(NotFoundMessage.OrderNotFound);
      }
      order.status = OrderStatus.Ordered;
      payment.status = true;
      await Promise.all([
        await this.orderRepository.save(order),
        await this.paymentRepository.save(payment),
      ]);
      return process.env.FRONTEND_SUCCESS_PAYMENT_URL;
    } else {
      return process.env.FRONTEND_FAILED_PAYMENT_URL;
    }
  }
  async find() {
    return await this.paymentRepository.find({
      where: {},
      order: {
        created_at: "DESC",
      },
    });
  }
}
