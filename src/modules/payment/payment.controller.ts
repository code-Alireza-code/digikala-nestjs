import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { StandardFormType } from "@/common/decorators/formType.decorator";
import { AddressDto } from "./dtos/address.dto";
import { VerifyPaymentQuery } from "./types/query";
import type { Response } from "express";
import { ApiOperation } from "@nestjs/swagger";

@Controller("payment")
export class PaymentController {
  constructor(private paymentService: PaymentService) {}
  @Post()
  @StandardFormType()
  create(@Body() addressDto: AddressDto) {
    return this.paymentService.create(addressDto);
  }
  @Get("/verify")
  async verify(@Query() query: VerifyPaymentQuery, @Res() res: Response) {
    const url = await this.paymentService.verify(query);
    return res.redirect(url);
  }
  @Get()
  @ApiOperation({ summary: "get all payments" })
  find() {
    return this.paymentService.find();
  }
}
