import { ToBoolean } from "@/common/decorators/toBoolean.decorator";
import { Trim } from "@/common/decorators/trim.decorator";
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, Max, Min } from "class-validator";

export class AddColorDto {
  @ApiProperty()
  productId: number;
  @ApiProperty()
  @Trim()
  color_name: string;
  @ApiProperty()
  @Trim()
  color_code: string;
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
export class UpdateColorDto extends PartialType(AddColorDto) {}
