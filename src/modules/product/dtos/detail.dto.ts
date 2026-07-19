import { ApiProperty, PartialType } from "@nestjs/swagger";

export class AddDetailDto {
  @ApiProperty()
  prouctId: string;
  @ApiProperty()
  key: number;
  @ApiProperty()
  value: number;
}
export class UpdateDetailDto extends PartialType(AddDetailDto) {}
