import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableShutdownHooks();

	await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
