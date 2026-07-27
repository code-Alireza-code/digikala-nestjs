import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "./entites/order.entity";
import { Repository } from "typeorm";
import { OrderStatus } from "./enum/order-status.enum";
import {
  BadRequestMessage,
  NotFoundMessage,
  PublicMessage,
} from "@/common/enum/message.enum";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private OrderRepository: Repository<OrderEntity>,
  ) {}
  async getAllOrdered() {
    return this.OrderRepository.find({
      where: { status: OrderStatus.Ordered },
    });
  }
  async findOneById(orderId: number) {
    const order = await this.OrderRepository.findOneBy({ id: orderId });
    if (!order) {
      throw new NotFoundException(NotFoundMessage.OrderNotFound);
    }
    return order;
  }
  async setInProcess(orderId: number) {
    const order = await this.findOneById(orderId);
    if (order.status !== OrderStatus.Ordered) {
      throw new BadRequestException(BadRequestMessage.OrderStatusNotOrdered);
    }
    order.status = OrderStatus.InProcess;
    await this.OrderRepository.save(order);
    return {
      message: PublicMessage.OrderStatusChanged,
    };
  }
  async setPacked(orderId: number) {
    const order = await this.findOneById(orderId);
    if (order.status !== OrderStatus.InProcess) {
      throw new BadRequestException(BadRequestMessage.OrderStatusNotInProcess);
    }
    order.status = OrderStatus.Packed;
    await this.OrderRepository.save(order);
    return {
      message: PublicMessage.OrderStatusChanged,
    };
  }
  async setInTransit(orderId: number) {
    const order = await this.findOneById(orderId);
    if (order.status !== OrderStatus.Packed) {
      throw new BadRequestException(BadRequestMessage.OrderStatusNotPacked);
    }
    order.status = OrderStatus.InTransit;
    await this.OrderRepository.save(order);
    return {
      message: PublicMessage.OrderStatusChanged,
    };
  }
  async setDelivered(orderId: number) {
    const order = await this.findOneById(orderId);
    if (order.status !== OrderStatus.InTransit) {
      throw new BadRequestException(BadRequestMessage.OrderStatusNotInTransit);
    }
    order.status = OrderStatus.InTransit;
    await this.OrderRepository.save(order);
    return {
      message: PublicMessage.OrderStatusChanged,
    };
  }
  async setCanceled(orderId: number) {
    const order = await this.findOneById(orderId);
    if (order.status === OrderStatus.InTransit) {
      throw new BadRequestException(BadRequestMessage.OrderCanNotCanceled);
    }
    order.status = OrderStatus.Canceled;
    await this.OrderRepository.save(order);
    return {
      message: PublicMessage.OrderStatusChanged,
    };
  }
}
