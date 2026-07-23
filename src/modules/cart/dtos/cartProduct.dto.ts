import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsInt } from "class-validator";

export class AddToCartDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  productId: number;
  @ApiPropertyOptional({ description: "enter if sizeId is empty " })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  colorId: number;
  @ApiPropertyOptional({ description: "enter if colorId is empty " })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  sizeId: number;
}
