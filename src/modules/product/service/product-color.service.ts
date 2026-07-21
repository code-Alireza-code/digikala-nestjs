import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AddColorDto, UpdateColorDto } from "../dtos/color.dto";
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductColorEntity } from "../entities/product-color.entity";
import { ProductEntity } from "../entities/product.entity";
import {
  BadRequestMessage,
  ConflictMessage,
  NotFoundMessage,
  PublicMessage,
} from "@/common/enum/message.enum";
import { ProductType } from "../enum/type.enum";

@Injectable()
export class ProductColorService {
  constructor(
    @InjectRepository(ProductColorEntity)
    private productColorRepository: Repository<ProductColorEntity>,
    private dataSource: DataSource,
  ) {}
  async create(colorDto: AddColorDto) {
    const {
      active_discount,
      count,
      discount,
      price,
      productId,
      color_code,
      color_name,
    } = colorDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const product = await queryRunner.manager.findOneBy(ProductEntity, {
        id: productId,
      });
      if (!product) {
        throw new NotFoundException(NotFoundMessage.ProductNotFound);
      }
      if (product.type !== ProductType.Coloring) {
        throw new BadRequestException(BadRequestMessage.ProductTypeNotColoring);
      }
      const existingColor = await queryRunner.manager.findOneBy(
        ProductColorEntity,
        { color_name, color_code },
      );
      if (existingColor) {
        throw new ConflictException(ConflictMessage.ProductColorAlreadyExist);
      }
      await queryRunner.manager.insert(ProductColorEntity, {
        active_discount,
        count,
        discount,
        price,
        productId,
        color_code,
        color_name,
      });
      if (count > 0) {
        product.count += count;
        await queryRunner.manager.save(ProductEntity, product);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    return { message: PublicMessage.ProductColorCreated };
  }
  async findOneByColorName(color_name: string) {
    return await this.productColorRepository.findOneBy({ color_name });
  }
  async update(id: number, colorDto: UpdateColorDto) {
    const {
      active_discount,
      count,
      discount,
      price,
      productId,
      color_code,
      color_name,
    } = colorDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const productColor = await queryRunner.manager.findOneBy(
        ProductColorEntity,
        { id },
      );
      if (!productColor) {
        throw new NotFoundException(NotFoundMessage.ProductColorNotFound);
      }
      const product = await queryRunner.manager.findOneBy(ProductEntity, {
        id: productColor.productId,
      });
      if (!product) {
        throw new NotFoundException(NotFoundMessage.ProductNotFound);
      }
      if (product.type !== ProductType.Coloring) {
        throw new BadRequestException(BadRequestMessage.ProductTypeNotColoring);
      }
      if (active_discount) productColor.active_discount = active_discount;
      if (productId) productColor.productId = productId;
      if (discount) productColor.discount = discount;
      if (price) productColor.price = price;
      if (color_code) productColor.color_code = color_code;
      if (color_name) productColor.color_name = color_name;

      let previousCount = productColor.count;
      if (count && count > 0) {
        product.count = product.count - previousCount;
        product.count += count;
        productColor.count = count;
        await queryRunner.manager.save(ProductEntity, product);
      }
      await queryRunner.manager.save(ProductColorEntity, productColor);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    return { message: PublicMessage.ProductColorUpdated };
  }
  async findAll(productId: number) {
    return await this.productColorRepository.find({
      where: { productId },
    });
  }
  async findOneById(id: number) {
    const productColor = await this.productColorRepository.findOneBy({ id });
    if (!productColor) {
      throw new NotFoundException(NotFoundMessage.ProductColorNotFound);
    }
    return productColor;
  }
  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const productColor = await queryRunner.manager.findOneBy(
        ProductColorEntity,
        { id },
      );
      if (!productColor) {
        throw new NotFoundException(NotFoundMessage.ProductColorNotFound);
      }
      const product = await queryRunner.manager.findOneBy(ProductEntity, {
        id: productColor.productId,
      });
      if (!product) {
        throw new NotFoundException(NotFoundMessage.ProductNotFound);
      }
      product.count -= productColor.count;
      await queryRunner.manager.save(ProductEntity, product);
      await queryRunner.manager.delete(ProductColorEntity, { id });
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    return { message: PublicMessage.ProductColorDeleted };
  }
}
