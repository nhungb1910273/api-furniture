import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { appConfig } from './app.config';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('api');
	app.enableCors();
	app.useGlobalPipes(
		new ValidationPipe({
			// whitelist: true,
			// forbidNonWhitelisted: true,
			// forbidUnknownValues: false, // <- this line
			transform: true,
		}),
	);

	const config = new DocumentBuilder()
		.setTitle(appConfig.name)
		.setDescription('APIs Document')
		.setVersion(appConfig.version)
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup('docs', app, document);

	await app.listen(3000);
	console.log("App's listening on 3000 : ", process.env.MONGO_URI);
}

bootstrap();
