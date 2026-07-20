import {
  NotFoundException,
  Injectable,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "../entities/product.entity";
import { DeepPartial, Repository } from "typeorm";
import { CreateProductDto, UpdateProductDto } from "../dtos/product.dto";
import { ProductType } from "../enum/type.enum";
import {
  PublicMessage,
  NotFoundMessage,
  BadRequestMessage,
} from "@/common/enum/message.enum";

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
    } else {
      throw new BadRequestException(BadRequestMessage.ProductTypeInvalid);
    }
    await this.productRepository.save(productObject);
    return {
      message: PublicMessage.ProductCreated,
    };
  }
  async findAll() {
    return await this.productRepository.find({
      where: {},
      relations: {
        colors: true,
        sizes: true,
        details: true,
      },
      select: {
        details: {
          key: true,
          value: true,
        },
      },
    });
  }
  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        colors: true,
        sizes: true,
        details: true,
      },
    });
    if (!product) {
      throw new NotFoundException(NotFoundMessage.ProductNotFound);
    }
    return product;
  }
  async findOneLean(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(NotFoundMessage.ProductNotFound);
    }
    return product;
  }
  async remove(id: number) {
    await this.findOne(id);
    await this.productRepository.delete({ id });
    return { message: PublicMessage.Productdeleted };
  }
  async update(id: number, productDto: UpdateProductDto) {
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
    const product = await this.findOneLean(id);
    if (title) product.title = title;
    if (content) product.content = content;
    if (discount) product.discount = discount;
    if (active_discount) product.active_discount = active_discount;
    if (code) product.code = code;
    if (slug) product.slug = slug;
    if (type === ProductType.Single) {
      Object.assign(product, { price, count });
    }
    await this.productRepository.save(product);
    return { message: PublicMessage.ProductUpdated };
  }
}
