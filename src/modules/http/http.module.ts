import { Global, Module } from "@nestjs/common";
import { ZarinapalService } from "./zarinpal.service";
import { HttpModule } from "@nestjs/axios";

@Global()
@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 5,
      timeout: 6000,
    }),
  ],
  providers: [ZarinapalService],
  exports: [ZarinapalService],
})
export class HttpApiModule {}
