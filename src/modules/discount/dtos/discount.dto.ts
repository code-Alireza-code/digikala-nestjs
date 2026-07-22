import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Matches,
  Max,
  Min,
} from "class-validator";
import { DiscountType } from "../enum/type.enum";
import { Trim } from "@/common/decorators/trim.decorator";

export class CreateDiscountDto {
  @ApiProperty()
  @Trim()
  code: string;
  @ApiPropertyOptional({ description: "only enter when amount is empty" })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  percent?: number;
  @ApiPropertyOptional({ description: "only enter when percent is empty" })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  @Min(1)
  amount?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
  @ApiPropertyOptional({
    description: "enter date in this format : YYYY-MM-DD ",
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "date must be in format YYYY-MM-DD",
  })
  @IsDateString(
    { strict: true },
    { message: "date must be a valid calendar date" },
  )
  expires_in?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  productId?: number;
  @ApiProperty({ enum: DiscountType })
  @IsEnum(DiscountType)
  type: string;
}
export class UpdateDiscountDto extends PartialType(CreateDiscountDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  usage?: number;
}

export class GetByCodeDto extends PickType(CreateDiscountDto, [
  "code",
] as const) {}
