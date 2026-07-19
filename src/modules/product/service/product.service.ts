import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "../entities/product.entity";
import { DeepPartial, Repository } from "typeorm";
import { CreateProductDto } from "../dtos/product.dto";
import { ProductType } from "../enum/type.enum";
import { PublicMessage } from "@/common/enum/message.enum";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}
  async create(productDto: CreateProductDto) {
    const {
      code,
      content,
      count,
      discount,
      price,
      slug,
      title,
      type,
      active_discount,
    } = productDto;
    const productObject: DeepPartial<ProductEntity> = {
      title,
      content,
      slug,
      code,
      discount,
      active_discount,
    };
    if (type === ProductType.Single) {
      Object.assign(productObject, { price, count, type });
    } else if (
      [ProductType.Coloring, ProductType.Sizing].includes(type as ProductType)
    ) {
      productObject.type = type;
    }
    await this.productRepository.save(productObject);
    return {
      message: PublicMessage.ProductCreated,
    };
  }
}
