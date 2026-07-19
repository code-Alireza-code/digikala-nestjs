import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsBoolean, Min } from "class-validator";

export class AddSizeDto {
  @ApiProperty()
  size: string;
  @ApiProperty()
  @Min(1)
  count: number;
  @ApiProperty()
  @Min(1)
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
export class UpdateSizeDto extends PartialType(AddSizeDto) {}
