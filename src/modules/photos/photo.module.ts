import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Photo, PhotoSchemaFactory } from './schemas/photo.schema';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: Photo.name,
				useFactory: PhotoSchemaFactory,
				inject: [],
				imports: [],
			},
		]),
	],
	providers: [PhotoService],
	exports: [PhotoService],
	controllers: [PhotoController],
})
export class PhotoModule {}
