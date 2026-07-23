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

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    private productService: ProductService,
    private productColorService: ProductColorService,
    private productSizeService: ProductSizeService,
  ) {}
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
}
