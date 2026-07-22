import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DiscountEntity } from "./entities/discount.entity";
import { DeepPartial, Repository } from "typeorm";
import { CreateDiscountDto, UpdateDiscountDto } from "./dtos/discount.dto";
import {
  BadRequestMessage,
  ConflictMessage,
  NotFoundMessage,
  PublicMessage,
} from "@/common/enum/message.enum";
import { DiscountType } from "./enum/type.enum";
import { ProductService } from "../product/service/product.service";

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(DiscountEntity)
    private discountRepository: Repository<DiscountEntity>,
    private productService: ProductService,
  ) {}
  async create(discountDto: CreateDiscountDto) {
    const { amount, code, expires_in, limit, percent, productId, type } =
      discountDto;
    const discountObject: DeepPartial<DiscountEntity> = {};
    const existingDiscount = await this.findOneByCode(code);
    if (existingDiscount) {
      throw new ConflictException(ConflictMessage.DiscountCodeAlreadyExist);
    }
    discountObject.code = code;
    if (
      ![DiscountType.Cart, DiscountType.Product].includes(type as DiscountType)
    ) {
      throw new BadRequestException(BadRequestMessage.InvalidDiscountType);
    }
    if (type === DiscountType.Product) {
      if (!productId) {
        throw new BadRequestException(BadRequestMessage.ProductIdRequired);
      }
      const product = await this.productService.findOneLean(productId);
      discountObject.productId = product.id;
    }
    if (type === DiscountType.Cart && productId) {
      throw new BadRequestException(BadRequestMessage.ProductIdContradiction);
    }
    discountObject.type = type;
    if ((amount && percent) || (!amount && !percent)) {
      throw new BadRequestException(BadRequestMessage.InvalidDiscountPriceType);
    }
    if (amount) {
      discountObject.amount = amount;
    }
    if (percent) {
      discountObject.percent = percent;
    }
    if (expires_in) {
      if (new Date(expires_in) < new Date()) {
        throw new BadRequestException(
          BadRequestMessage.ExpirationDateIsExpired,
        );
      }
      discountObject.expires_in = new Date(new Date(expires_in).getTime());
    }
    if (limit) {
      discountObject.limit = limit;
    }
    await this.discountRepository.save(discountObject);
    return { message: PublicMessage.DiscountCreated };
  }
  async update(id: number, discountDto: UpdateDiscountDto) {
    const { amount, code, expires_in, limit, percent, productId, type, usage } =
      discountDto;
    const discountObject: DeepPartial<DiscountEntity> = {};
    const discount = await this.findOneById(id);
    if (code) {
      const existingDiscount = await this.findOneByCode(code);
      if (existingDiscount) {
        throw new ConflictException(ConflictMessage.DiscountCodeAlreadyExist);
      }
      discountObject.code = code;
    }
    if (type) {
      if (
        ![DiscountType.Cart, DiscountType.Product].includes(
          type as DiscountType,
        )
      ) {
        throw new BadRequestException(BadRequestMessage.InvalidDiscountType);
      }
      if (type === DiscountType.Cart && productId) {
        throw new BadRequestException(BadRequestMessage.ProductIdContradiction);
      }
      if (type === DiscountType.Product) {
        if (!productId) {
          throw new BadRequestException(BadRequestMessage.ProductIdRequired);
        }
        const product = await this.productService.findOneLean(productId);
        discountObject.productId = product.id;
        discountObject.type = type;
      }
      if (type === DiscountType.Cart) {
        (discountObject.productId as any) = null;
        discountObject.type = type;
      }
    }
    if (amount && percent) {
      throw new BadRequestException(BadRequestMessage.InvalidDiscountPriceType);
    }
    if (amount) discountObject.amount = amount;
    if (usage) discountObject.usage = usage;
    if (percent) discountObject.percent = percent;

    if (expires_in) {
      if (new Date(expires_in) < new Date()) {
        throw new BadRequestException(
          BadRequestMessage.ExpirationDateIsExpired,
        );
      }
      discountObject.expires_in = new Date(new Date(expires_in).getTime());
    }
    if (limit) discountObject.limit = limit;

    if (Object.keys(discountObject).length) {
      await this.discountRepository.update({ id: discount.id }, discountObject);
    }
    return { message: PublicMessage.DiscountUpdated };
  }
  async findOneByCode(code: string, errorOnNotFound: boolean = false) {
    const discount = await this.discountRepository.findOneBy({ code });
    if (errorOnNotFound && !discount) {
      throw new NotFoundException(NotFoundMessage.DiscountNotFound);
    }
    return discount;
  }
  async findOneById(id: number) {
    const discount = await this.discountRepository.findOneBy({ id });
    if (!discount) {
      throw new NotFoundException(NotFoundMessage.DiscountNotFound);
    }
    return discount;
  }
  async findByProductId(productId: number) {
    await this.productService.findOneLean(productId);
    return await this.discountRepository.find({
      where: { productId, type: DiscountType.Product },
    });
  }
  async findAllCartDiscounts() {
    return await this.discountRepository.find({
      where: { type: DiscountType.Cart },
    });
  }
  async findAll() {
    return await this.discountRepository.find({});
  }
  async delete(id: number) {
    await this.findOneById(id);
    await this.discountRepository.delete({ id });
    return { message: PublicMessage.DiscountDeleted };
  }
}
