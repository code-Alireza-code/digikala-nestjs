import { applyDecorators } from "@nestjs/common";
import { ApiConsumes } from "@nestjs/swagger";
import { FormType } from "../enum/form-type.enum";

export function StandardFormType() {
  return applyDecorators(ApiConsumes(FormType.Urlencoded, FormType.Json));
}
