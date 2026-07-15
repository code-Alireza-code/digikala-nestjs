import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { config } from "dotenv";
config({ quiet: true });

export function TypeormConfig(): TypeOrmModuleOptions {
  const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } = process.env;
  return {
    type: "mysql",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    autoLoadEntities: false,
    synchronize: true,
    entities: ["dist/**/*.entity.{js,ts}"],
  };
}
