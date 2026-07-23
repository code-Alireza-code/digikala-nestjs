import { Trim } from "@/common/decorators/trim.decorator";
import { ApiProperty } from "@nestjs/swagger";

export class AddDiscountToCartDto {
  @ApiProperty()
  @Trim()
  code: string;
}
