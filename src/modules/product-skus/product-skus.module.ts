import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PhotoModule } from '../photos/photo.module';
import { SkuValuesModule } from '../sku-values/sku-values.module';
import { ProductSkusController } from './product-skus.controller';
import { ProductSkusService } from './product-skus.service';
import { ProductSku, ProductSkuSchema } from './schemas/product-skus.schemas';
import { ReviewsModule } from '../reviews/reviews.module';
import { OptionValuesModule } from '../option-values/option-values.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: ProductSku.name, schema: ProductSkuSchema },
		]),
		PhotoModule,
		SkuValuesModule,
		ReviewsModule,
		OptionValuesModule,
	],
	providers: [ProductSkusService],
	exports: [ProductSkusService],
	controllers: [ProductSkusController],
})
export class ProductSkusModule {}
