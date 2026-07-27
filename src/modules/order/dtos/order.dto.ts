import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNumber } from "class-validator";

export class OrderDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  orderId: number;
}
