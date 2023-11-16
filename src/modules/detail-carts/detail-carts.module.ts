import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DetailCart, DetailCartSchema } from './schemas/detail-carts.schema';
import { DetailCartsService } from './detail-carts.service';
import { DetailCartsController } from './detail-carts.controller';
import { ProductSkusModule } from '../product-skus/product-skus.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: DetailCart.name, schema: DetailCartSchema },
		]),
	],
	providers: [DetailCartsService],
	exports: [DetailCartsService],
	controllers: [DetailCartsController],
})
export class DetailCartsModule {}
