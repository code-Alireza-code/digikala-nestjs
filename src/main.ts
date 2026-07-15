import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app/app.module";
import { config } from "dotenv";
import { SwaggerConfig } from "./common/config/swagger.config";
import { INestApplication } from "@nestjs/common";
import chalk from "chalk";
config({ quiet: true });

async function bootstrap() {
  const port = process.env.APP_PORT;
  const app = await NestFactory.create<INestApplication>(AppModule);
  SwaggerConfig(app);
  await app.listen(port, () => {
    console.log(chalk.magentaBright(`server run on http://localhost:${port}`));
    console.log(
      chalk.magentaBright(`swagger run on http://localhost:${port}/swagger`),
    );
  });
}
bootstrap();
