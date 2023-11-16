import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesService } from './categories.service';
import { Category, CategorySchema } from './schemas/categories.schema';
import { CategoriesController } from './categories.controller';
import { PhotoModule } from '../photos/photo.module';
import { RoomFurnituresModule } from '../room-furnitures/room-furnitures.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Category.name, schema: CategorySchema },
		]),
		PhotoModule,
		RoomFurnituresModule,
	],
	providers: [CategoriesService],
	exports: [CategoriesService],
	controllers: [CategoriesController],
})
export class CategoriesModule {}
