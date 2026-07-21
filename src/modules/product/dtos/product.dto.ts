import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { ProductType } from "../enum/type.enum";
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import { ToBoolean } from "@/common/decorators/toBoolean.decorator";

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
  @ApiPropertyOptional({
    description: "only fill this field when product type is single",
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  count: number;
  @ApiPropertyOptional({
    description: "only fill this field when product type is single",
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  discount: number;
  @ApiPropertyOptional({ type: "boolean" })
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  active_discount: boolean;
}
export class UpdateProductDto extends PartialType(CreateProductDto) {}
