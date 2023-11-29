import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from '../categories/categories.module';
import { ProductSkusModule } from '../product-skus/product-skus.module';
import { RoomFurnituresModule } from '../room-furnitures/room-furnitures.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from './schemas/products.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
		CategoriesModule,
		RoomFurnituresModule,
		// SkuValuesModule,
		ProductSkusModule,
	],
	providers: [ProductsService],
	exports: [ProductsService],
	controllers: [ProductsController],
})
export class ProductsModule {}
