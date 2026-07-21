import { ToBoolean } from "@/common/decorators/toBoolean.decorator";
import { Trim } from "@/common/decorators/trim.decorator";
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, Min } from "class-validator";

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
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  @Min(1)
  discount: number;
  @ApiPropertyOptional({ type: "boolean" })
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  active_discount: boolean;
}
export class UpdateSizeDto extends PartialType(AddSizeDto) {}
