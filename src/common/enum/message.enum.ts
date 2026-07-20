export enum PublicMessage {
  ProductCreated = "product created successfuly !",
  Productdeleted = "product deleted successfuly !",
  ProductUpdated = "product udpated successfuly !",
  ProductDetailCreated = "product detail created successfuly !",
  ProductDetailUpdated = "product detail updated successfuly !",
  ProductDetailDeleted = "product detail deleted successfuly !",
}
export enum NotFoundMessage {
  ProductNotFound = "product not found !",
  ProductDetailNotFound = "product detail not found !",
}
export enum BadRequestMessage {
  ProductTypeInvalid = "product type is invalid !",
}

export enum ConflictMessage {
  ProductDetailAlreadyExist = "product detail with this key already exists !",
}
