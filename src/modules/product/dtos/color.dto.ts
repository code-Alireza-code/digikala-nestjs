import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsBoolean, Min } from "class-validator";

export class AddColorDto {
  @ApiProperty()
  color_name: string;
  @ApiProperty()
  color_code: string;
  @ApiProperty()
  @Min(0)
  count: number;
  @Min(1)
  @ApiProperty()
  price: number;
  @ApiProperty()
  @Min(1)
  discount: number;
  @ApiProperty({ type: "boolean" })
  @IsBoolean()
  active_discount: boolean;
  @ApiProperty()
  productId: number;
}
export class UpdateColorDto extends PartialType(AddColorDto) {}
