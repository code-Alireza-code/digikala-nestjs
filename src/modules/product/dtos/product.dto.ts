import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { ProductType } from "../enum/type.enum";
import { IsEnum, Min } from "class-validator";

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
  @ApiProperty()
  @Min(0)
  count: number;
  @ApiPropertyOptional()
  @Min(1)
  price: number;
  @ApiPropertyOptional()
  @Min(1)
  discount: number;
}
export class UpdateProductDto extends PartialType(CreateProductDto) {}
