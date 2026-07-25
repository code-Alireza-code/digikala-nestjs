import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartEntity } from "./entities/cart.entity";
import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import { AddToCartDto } from "./dtos/cartProduct.dto";
import { ProductService } from "../product/service/product.service";
import {
  BadRequestMessage,
  NotFoundMessage,
  PublicMessage,
} from "@/common/enum/message.enum";
import { ProductType } from "../product/enum/type.enum";
import { ProductColorService } from "../product/service/product-color.service";
import { ProductSizeService } from "../product/service/product-size.service";
import { DiscountType } from "../discount/enum/type.enum";
import { AddDiscountToCartDto } from "./dtos/dicount.dto";
import { DiscountService } from "../discount/discount.service";
import { DiscountEntity } from "../discount/entities/discount.entity";
import { ProductItem } from "./types/product";
import { DiscountItem } from "./types/discount";

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    private productService: ProductService,
    private productColorService: ProductColorService,
    private productSizeService: ProductSizeService,
    private discountService: DiscountService,
  ) {}
  async getCart() {
    let products: ProductItem[] = [];
    let discounts: DiscountItem[] = [];
    let finalAmount = 0;
    let totalPrice = 0;
    let totalDiscountAmount = 0;
    const items = await this.cartRepository.find({
      where: {},
      relations: {
        product: true,
        color: true,
        size: true,
        discount: true,
      },
    });
    const productDiscounts = items.filter(
      (item) =>
        item?.discountId && item?.discount?.type === DiscountType.Product,
    );
    for (const item of items) {
      const { product, color, size, discount, count } = item;
      let discountAmount = 0;
      if (product?.type === ProductType.Single) {
        totalPrice += +product.price;
        if (product?.active_discount) {
          const { newDiscountAmount, newPrice } = this.checkDiscountPercent(
            +product.price,
            +product.discount,
          );
          discountAmount = newDiscountAmount;
          product.price = newPrice;
          totalDiscountAmount += discountAmount;
        }
        const existDiscount = productDiscounts.find(
          (dis) => dis.productId === product.id,
        );
        if (existDiscount) {
          const { discount } = existDiscount;
          if (this.validateDiscount(discount)) {
            discounts.push({
              percent: discount.percent,
              amount: discount.amount,
              code: discount.code,
              type: discount.type,
              productId: discount.productId,
            });
            if (discount.percent) {
              const { newDiscountAmount, newPrice } = this.checkDiscountPercent(
                product.price,
                discount.percent,
              );
              product.price = newPrice;
              discountAmount += newDiscountAmount;
            } else if (discount.amount) {
              const { newDiscountAmount, newPrice } = this.checkDiscountAmount(
                product.price,
                discount.amount,
              );
              product.price = newPrice;
              discountAmount += newDiscountAmount;
            }
            totalDiscountAmount += discountAmount;
          }
        }
        finalAmount += +product.price * count;
        products.push({
          id: product.id,
          slug: product.slug,
          title: product.title,
          active_discount: product.active_discount,
          discount: product.discount,
          price: product.price,
        });
      } else if (product?.type === ProductType.Sizing) {
        totalPrice += +size.price;
        if (size?.active_discount) {
          const { newDiscountAmount, newPrice } = this.checkDiscountPercent(
            +size.price,
            +size.discount,
          );
          discountAmount = newDiscountAmount;
          size.price = newPrice;
        }
        const existDiscount = productDiscounts.find(
          (dis) => dis.productId === product.id,
        );
        if (existDiscount) {
          const { discount } = existDiscount;
          if (this.validateDiscount(discount)) {
            discounts.push({
              percent: discount.percent,
              amount: discount.amount,
              code: discount.code,
              type: discount.type,
              productId: discount.productId,
            });
            if (discount.percent) {
              const { newDiscountAmount, newPrice } = this.checkDiscountPercent(
                size.price,
                discount.percent,
              );
              size.price = newPrice;
              discountAmount += newDiscountAmount;
            } else if (discount.amount) {
              const { newDiscountAmount, newPrice } = this.checkDiscountAmount(
                size.price,
                discount.amount,
              );
              size.price = newPrice;
              discountAmount += newDiscountAmount;
            }
          }
        }
        totalDiscountAmount += discountAmount;
        finalAmount += +size.price * count;
        products.push({
          id: product.id,
          slug: product.slug,
          title: product.title,
          active_discount: size.active_discount,
          discount: size.discount,
          sizeId: size.id,
          price: size.price,
          size: size.size,
        });
      } else if (product?.type === ProductType.Coloring) {
        totalPrice += +color.price;
        if (color?.active_discount) {
          const { newDiscountAmount, newPrice } = this.checkDiscountPercent(
            +color.price,
            +color.discount,
          );
          discountAmount = newDiscountAmount;
          color.price = newPrice;
        }
        const existDiscount = productDiscounts.find(
          (dis) => dis.productId === product.id,
        );
        if (existDiscount) {
          const { discount } = existDiscount;
          if (this.validateDiscount(discount)) {
            discounts.push({
              percent: discount.percent,
              amount: discount.amount,
              code: discount.code,
              type: discount.type,
              productId: discount.productId,
            });
            if (discount.percent) {
              const { newDiscountAmount, newPrice } = this.checkDiscountPercent(
                color.price,
                discount.percent,
              );
              color.price = newPrice;
              discountAmount += newDiscountAmount;
            } else if (discount.amount) {
              const { newDiscountAmount, newPrice } = this.checkDiscountAmount(
                color.price,
                discount.amount,
              );
              color.price = newPrice;
              discountAmount += newDiscountAmount;
            }
          }
        }
        totalDiscountAmount += discountAmount;
        finalAmount += +color.price * count;
        products.push({
          id: product.id,
          slug: product.slug,
          title: product.title,
          active_discount: color.active_discount,
          discount: color.discount,
          price: color.price,
          colorId: color.id,
          color_code: color.color_code,
          color_name: color.color_name,
        });
      } else if (discount) {
        if (this.validateDiscount(discount)) {
          if (discount.type === DiscountType.Cart) {
            discounts.push({
              percent: discount.percent,
              amount: discount.amount,
              code: discount.code,
              type: discount.type,
              productId: discount.productId,
            });
            if (discount.percent) {
              const { newDiscountAmount, newPrice } = this.checkDiscountPercent(
                finalAmount,
                discount.percent,
              );
              finalAmount = newPrice;
              discountAmount = +newDiscountAmount;
            } else if (discount.amount) {
              const { newDiscountAmount, newPrice } = this.checkDiscountAmount(
                finalAmount,
                discount.amount,
              );
              finalAmount = newPrice;
              discountAmount = newDiscountAmount;
            }
            totalDiscountAmount += discountAmount;
          }
        }
      }
    }
    return {
      totalPrice,
      finalAmount,
      totalDiscountAmount,
      productDiscounts,
      products,
      discounts,
    };
  }
  async addProductToCart(cartDto: AddToCartDto) {
    const { productId, sizeId, colorId } = cartDto;
    const product = await this.productService.findOneLean(productId);
    const existingCart = await this.findExistingProductInCart(
      product.id,
      sizeId,
      colorId,
    );
    if (sizeId && colorId) {
      throw new BadRequestException(
        BadRequestMessage.SizeIdAndColorIdContradiction,
      );
    }
    if (product.type === ProductType.Single && (sizeId || colorId)) {
      throw new BadRequestException(
        BadRequestMessage.ProductColorAndSizeNotAllowed,
      );
    }
    if (existingCart) {
      switch (product.type) {
        case ProductType.Coloring:
          await this.checkProductColorStock(colorId, existingCart.count);
          break;
        case ProductType.Sizing:
          await this.checkProductSizeStock(sizeId, existingCart.count);
          break;
        case ProductType.Single:
          await this.checkProductStock(productId, existingCart.count);
          break;
        default:
          throw new BadRequestException(BadRequestMessage.ProductTypeInvalid);
      }
      existingCart.count += 1;
      await this.cartRepository.save(existingCart);
    } else {
      const cartObject: DeepPartial<CartEntity> = {};
      switch (product.type) {
        case ProductType.Coloring: {
          if (!colorId || sizeId) {
            throw new BadRequestException(BadRequestMessage.ColorIdRequired);
          }
          const productColor = await this.checkProductColorStock(colorId, 1);
          cartObject.colorId = productColor.id;
          break;
        }
        case ProductType.Sizing: {
          if (!sizeId || colorId) {
            throw new BadRequestException(BadRequestMessage.SizeIdRequired);
          }
          const productSize = await this.checkProductSizeStock(sizeId, 1);
          cartObject.sizeId = productSize.id;
          break;
        }
        case ProductType.Single:
          await this.checkProductStock(productId, 1);
          break;
        default:
          throw new BadRequestException(BadRequestMessage.ProductTypeInvalid);
      }
      cartObject.productId = productId;
      // this is example : in real scenario get userId in req
      cartObject.userId = 1;
      cartObject.count = 1;
      await this.cartRepository.insert(cartObject);
    }
    return { message: PublicMessage.ProductAddedToCart };
  }
  async removeProductFromCart(productId: number) {
    const cartProduct = await this.checkByProductId(productId);
    if (cartProduct.count <= 1) {
      await this.cartRepository.delete({ productId });
    } else {
      cartProduct.count -= 1;
      await this.cartRepository.save(cartProduct);
    }
    return { message: PublicMessage.ProductRemovedFromCart };
  }
  async addDiscountToCart(discountDto: AddDiscountToCartDto) {
    const userId = 1;
    const { code } = discountDto;
    const discount = (await this.discountService.findOneByCode(code, true))!;
    if (
      discount.limit &&
      (discount.limit === 0 || discount.limit <= discount.usage)
    ) {
      throw new BadRequestException(BadRequestMessage.DiscountCodeLimitReached);
    }
    if (discount.expires_in && discount.expires_in < new Date()) {
      throw new BadRequestException(BadRequestMessage.DiscountCodeExpired);
    }
    const existedDiscount = await this.cartRepository.findOneBy({
      discountId: discount.id,
    });
    if (existedDiscount) {
      throw new BadRequestException(BadRequestMessage.DiscountAlreadyInUse);
    }
    if (discount.type === DiscountType.Product) {
      const discountedProducts = await this.cartRepository.findBy({
        productId: discount.productId,
      });
      if (!discountedProducts) {
        throw new BadRequestException(
          BadRequestMessage.ForbiddenProductDiscount,
        );
      }
      for (const item of discountedProducts) {
        await this.cartRepository.update(
          { id: item.id },
          { discountId: discount.id },
        );
      }
    }
    if (discount.type === DiscountType.Cart) {
      const existedPublicDiscount = await this.cartRepository.findOne({
        relations: {
          discount: true,
        },
        where: {
          discount: {
            type: DiscountType.Cart,
          },
        },
      });
      if (existedPublicDiscount) {
        throw new BadRequestException(
          BadRequestMessage.DiscountUsageLimitReached,
        );
      }
      await this.cartRepository.update({ userId }, { discountId: discount.id });
    }
    return { message: PublicMessage.DiscountAddedToCart };
  }
  async removeDiscountFromCart(discountDto: AddDiscountToCartDto) {
    const { code } = discountDto;
    const discount = (await this.discountService.findOneByCode(code, true))!;
    const discountedProducts = await this.cartRepository.findBy({
      discountId: discount.id,
    });
    if (!discountedProducts) {
      throw new BadRequestException(BadRequestMessage.DiscountIsNotInCart);
    }
    for (const item of discountedProducts) {
      await this.cartRepository.update({ id: item.id }, { discountId: null });
    }
    return { message: PublicMessage.DiscountRemovedFromCart };
  }
  async findExistingProductInCart(
    productId: number,
    sizeId: number,
    colorId: number,
  ) {
    const where: FindOptionsWhere<CartEntity> = { productId };
    if (sizeId) where.sizeId = sizeId;
    if (colorId) where.colorId = colorId;
    return await this.cartRepository.findOne({
      where,
    });
  }
  async checkByProductId(productId: number) {
    const cartProduct = await this.cartRepository.findOneBy({ productId });
    if (!cartProduct) {
      throw new NotFoundException(NotFoundMessage.ProductNotFoundInCart);
    }
    return cartProduct;
  }
  async checkProductColorStock(colorId: number, amount: number) {
    const productColor = await this.productColorService.findOneById(colorId);
    if (productColor.count <= amount) {
      throw new BadRequestException(BadRequestMessage.ProductColorOutOfStock);
    }
    return productColor;
  }
  async checkProductSizeStock(sizeId: number, amount: number) {
    const productSize = await this.productSizeService.findOneById(sizeId);
    if (productSize.count <= amount) {
      throw new BadRequestException(BadRequestMessage.ProductSizeOutOfStock);
    }
    return productSize;
  }
  async checkProductStock(productId: number, amount: number) {
    const product = await this.productService.findOneLean(productId);
    if (product.count <= amount) {
      throw new BadRequestException(BadRequestMessage.ProductOutOfStock);
    }
    return product;
  }
  validateDiscount(discount: DiscountEntity) {
    let limitCondition = discount.limit && discount.limit > discount.usage;
    let timeCondition = discount.expires_in && discount.expires_in > new Date();
    return limitCondition || timeCondition;
  }
  checkDiscountPercent(price: number, percent: number) {
    let newDiscountAmount = +price * (+percent / 100);
    let newPrice = +newDiscountAmount > +price ? 0 : +price - newDiscountAmount;
    return {
      newPrice,
      newDiscountAmount,
    };
  }
  checkDiscountAmount(price: number, amount: number) {
    let newPrice = +amount > +price ? 0 : +price - +amount;
    return {
      newPrice,
      newDiscountAmount: +amount,
    };
  }
}
