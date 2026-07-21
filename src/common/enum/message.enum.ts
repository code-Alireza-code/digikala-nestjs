export enum PublicMessage {
  ProductCreated = "product created successfuly !",
  Productdeleted = "product deleted successfuly !",
  ProductUpdated = "product udpated successfuly !",
  ProductDetailCreated = "product detail created successfuly !",
  ProductDetailUpdated = "product detail updated successfuly !",
  ProductDetailDeleted = "product detail deleted successfuly !",
  ProductSizeCreated = "product size created successfuly !",
  ProductSizeUpdated = "product size updated successfuly !",
  ProductSizeDeleted = "product size deleted successfuly !",
  ProductColorCreated = "product color created successfuly !",
  ProductColorUpdated = "product color updated successfuly !",
  ProductColorDeleted = "product color deleted successfuly !",
}
export enum NotFoundMessage {
  ProductNotFound = "product not found !",
  ProductDetailNotFound = "product detail not found !",
  ProductSizeNotFound = "product size not found !",
  ProductColorNotFound = "product color not found !",
}
export enum BadRequestMessage {
  ProductTypeInvalid = "product type is invalid !",
  ProductTypeNotSizing = "this product type is not sizing !",
  ProductTypeNotColoring = "this product type is not coloring !",
}

export enum ConflictMessage {
  ProductDetailAlreadyExist = "product detail with this key already exists !",
  ProductSizeAlreadyExist = "product size with this size already exists !",
  ProductColorAlreadyExist = "product color with this color already exists !",
}
