import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductSizeEntity } from "../entities/product-size.entity";
import { DataSource, Repository } from "typeorm";
import { AddSizeDto, UpdateSizeDto } from "../dtos/size.dto";
import { ProductService } from "./product.service";
import {
  BadRequestMessage,
  ConflictMessage,
  NotFoundMessage,
  PublicMessage,
} from "@/common/enum/message.enum";
import { ProductType } from "../enum/type.enum";
import { ProductEntity } from "../entities/product.entity";

@Injectable()
export class ProductSizeService {
  constructor(
    @InjectRepository(ProductSizeEntity)
    private productSizeRepository: Repository<ProductSizeEntity>,
    private dataSource: DataSource,
  ) {}
  async create(sizeDto: AddSizeDto) {
    const { active_discount, count, discount, price, productId, size } =
      sizeDto;
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
      if (product.type !== ProductType.Sizing) {
        throw new BadRequestException(BadRequestMessage.ProductTypeNotSizing);
      }
      const existingSize = await queryRunner.manager.findOneBy(
        ProductSizeEntity,
        { size },
      );
      if (existingSize) {
        throw new ConflictException(ConflictMessage.ProductSizeAlreadyExist);
      }
      await queryRunner.manager.insert(ProductSizeEntity, {
        active_discount,
        count,
        discount,
        price,
        productId,
        size,
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
    return { message: PublicMessage.ProductSizeCreated };
  }
  async findOneBySize(size: string) {
    return await this.productSizeRepository.findOneBy({ size });
  }
  async update(id: number, sizDto: UpdateSizeDto) {
    const { active_discount, count, discount, price, productId, size } = sizDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const productSize = await queryRunner.manager.findOneBy(
        ProductSizeEntity,
        { id },
      );
      if (!productSize) {
        throw new NotFoundException(NotFoundMessage.ProductSizeNotFound);
      }
      const product = await queryRunner.manager.findOneBy(ProductEntity, {
        id: productSize.productId,
      });
      if (!product) {
        throw new NotFoundException(NotFoundMessage.ProductNotFound);
      }
      if (product.type !== ProductType.Sizing) {
        throw new BadRequestException(BadRequestMessage.ProductTypeNotSizing);
      }
      if (active_discount) productSize.active_discount = active_discount;
      if (productId) productSize.productId = productId;
      if (discount) productSize.discount = discount;
      if (price) productSize.price = price;
      if (size) productSize.size = size;

      let previousCount = productSize.count;
      if (count && count > 0) {
        product.count = product.count - previousCount;
        product.count += count;
        productSize.count = count;
        await queryRunner.manager.save(ProductEntity, product);
      }
      await queryRunner.manager.save(ProductSizeEntity, productSize);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    return { message: PublicMessage.ProductSizeUpdated };
  }
  async findAll(productId: number) {
    return await this.productSizeRepository.find({
      where: { productId },
    });
  }
  async findOneById(id: number) {
    const productSize = await this.productSizeRepository.findOneBy({ id });
    if (!productSize) {
      throw new NotFoundException(NotFoundMessage.ProductSizeNotFound);
    }
    return productSize;
  }
  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const productSize = await queryRunner.manager.findOneBy(
        ProductSizeEntity,
        { id },
      );
      if (!productSize) {
        throw new NotFoundException(NotFoundMessage.ProductSizeNotFound);
      }
      const product = await queryRunner.manager.findOneBy(ProductEntity, {
        id: productSize.productId,
      });
      if (!product) {
        throw new NotFoundException(NotFoundMessage.ProductNotFound);
      }
      product.count -= productSize.count;
      await queryRunner.manager.save(ProductEntity, product);
      await queryRunner.manager.delete(ProductSizeEntity, { id });
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    return { message: PublicMessage.ProductSizeDeleted };
  }
}
