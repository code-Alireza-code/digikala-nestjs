import { Trim } from "@/common/decorators/trim.decorator";
import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AddDetailDto {
  @ApiProperty()
  productId: number;
  @ApiProperty()
  @Trim()
  @IsString()
  key: string;
  @ApiProperty()
  @Trim()
  @IsString()
  value: string;
}
export class UpdateDetailDto extends PartialType(AddDetailDto) {}
