import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductDetailEntity } from "../entities/product-detail.entity";
import { Repository } from "typeorm";
import { AddDetailDto, UpdateDetailDto } from "../dtos/detail.dto";
import { ProductService } from "./product.service";
import {
  ConflictMessage,
  NotFoundMessage,
  PublicMessage,
} from "@/common/enum/message.enum";

@Injectable()
export class ProductDetailService {
  constructor(
    @InjectRepository(ProductDetailEntity)
    private productDetailRepository: Repository<ProductDetailEntity>,
    private productService: ProductService,
  ) {}
  async create(detailDto: AddDetailDto) {
    const { key, value, productId } = detailDto;
    await this.productService.findOneLean(productId);
    const detail = await this.findOneByKey(key);
    if (detail) {
      throw new ConflictException(ConflictMessage.ProductDetailAlreadyExist);
    }
    await this.productDetailRepository.insert({ key, value, productId });
    return { message: PublicMessage.ProductDetailCreated };
  }
  async update(id: number, detailDto: UpdateDetailDto) {
    const { key, value, productId } = detailDto;
    const detail = await this.findOneById(id);
    if (productId) {
      const product = await this.productService.findOneLean(productId);
      detail.productId = product.id;
    }
    if (key) detail.key = key;
    if (value) detail.value = value;
    await this.productDetailRepository.save(detail);
    return { message: PublicMessage.ProductDetailUpdated };
  }
  async findAll(productId: number) {
    return this.productDetailRepository.find({
      where: { productId },
    });
  }
  async findOneByKey(key: string) {
    return await this.productDetailRepository.findOneBy({ key });
  }
  async findOneById(id: number) {
    const detail = await this.productDetailRepository.findOneBy({ id });
    if (!detail) {
      throw new NotFoundException(NotFoundMessage.ProductDetailNotFound);
    }
    return detail;
  }
  async remove(id: number) {
    await this.findOneById(id);
    await this.productDetailRepository.delete({ id });
    return { message: PublicMessage.ProductDetailDeleted };
  }
}
