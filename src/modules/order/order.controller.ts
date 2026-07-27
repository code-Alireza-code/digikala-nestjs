import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { StandardFormType } from "@/common/decorators/formType.decorator";
import { OrderDto } from "./dtos/order.dto";

@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Get()
  getAllOrdered() {
    return this.orderService.getAllOrdered();
  }
  @Get("/:id")
  findOneById(@Param("id", ParseIntPipe) id: number) {
    return this.orderService.findOneById(id);
  }
  @Post()
  @StandardFormType()
  setInProcess(@Body() orderDto: OrderDto) {
    return this.orderService.setInProcess;
  }
  @Post()
  @StandardFormType()
  setPacked(@Body() orderDto: OrderDto) {
    return this.orderService.setPacked;
  }
  @Post()
  @StandardFormType()
  setInTransit(@Body() orderDto: OrderDto) {
    return this.orderService.setInTransit;
  }
  @Post()
  @StandardFormType()
  setDelivered(@Body() orderDto: OrderDto) {
    return this.orderService.setDelivered;
  }
  @Post()
  @StandardFormType()
  setCanceled(@Body() orderDto: OrderDto) {
    return this.orderService.setCanceled;
  }
}
