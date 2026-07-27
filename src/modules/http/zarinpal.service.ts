import { HttpService } from "@nestjs/axios";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { ZarinpalRequestData } from "./types/zarinpal";
import { catchError, lastValueFrom, map } from "rxjs";
import {
  BadRequestMessage,
  InternalServerErrorMessage,
} from "@/common/enum/message.enum";

@Injectable()
export class ZarinapalService {
  constructor(private httpService: HttpService) {}
  async sendRequest(data: ZarinpalRequestData) {
    const { amount, description } = data;
    const requestData = {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      callback_url: process.env.ZARINPAL_CALLBACK_URL,
      amount,
      description,
    };
    const result = await lastValueFrom(
      this.httpService
        .post(process.env.ZARINPAL_REQUEST_URL, requestData)
        .pipe(map((res) => res.data))
        .pipe(
          catchError((err) => {
            console.log(err);
            throw new InternalServerErrorException(
              InternalServerErrorMessage.ZarinpalRequestFailed,
            );
          }),
        ),
    );
    const { authority, code } = result.data;
    if (code === 100 && authority) {
      return {
        code,
        authority,
        gatewayURL: `${process.env.ZARINPAL_GATEWAY_URL}/${authority}`,
      };
    }
    throw new BadRequestException(BadRequestMessage.ZarinpalGatewayError);
  }
  async verifyRequest(data?: any) {
    this.httpService.post(process.env.ZARINPAL_VERIFY_URL, data, {});
  }
}
