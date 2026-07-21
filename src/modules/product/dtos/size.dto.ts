import { ToBoolean } from "@/common/decorators/toBoolean.decorator";
import { Trim } from "@/common/decorators/trim.decorator";
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, Max, Min } from "class-validator";

export class AddSizeDto {
  @ApiProperty()
  productId: number;
  @ApiProperty()
  @Trim()
  size: string;
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  count: number;
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  price: number;
  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  discount: number;
  @ApiPropertyOptional({ type: "boolean" })
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  active_discount: boolean;
}
export class UpdateSizeDto extends PartialType(AddSizeDto) {}
