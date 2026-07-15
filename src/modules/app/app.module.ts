import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeormConfig } from "src/common/config/typeorm.config";

@Module({
  imports: [TypeOrmModule.forRoot(TypeormConfig())],
})
export class AppModule {}
