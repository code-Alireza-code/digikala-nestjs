import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { ProductType } from "../enum/type.enum";
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsPositive,
  Max,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateProductDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: string;
  @ApiProperty()
  slug: string;
  @ApiProperty()
  code: string;
  @IsEnum(ProductType)
  @ApiProperty({ enum: ProductType })
  type: string;
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  count: number;
  @ApiProperty({ type: "boolean" })
  @Type(() => Boolean)
  @IsBoolean()
  active_discount: boolean;
  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;
  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  discount: number;
}
export class UpdateProductDto extends PartialType(CreateProductDto) {}
