import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from '../products/product.module';
import {
	WarehouseReceiptDetail,
	WarehouseReceiptDetailSchema,
} from './schemas/warehouse-receipt-details.schema';
import { WarehouseReceiptDetailsService } from './warehouse-receipt-details.service';
import { ProductSkusModule } from '../product-skus/product-skus.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: WarehouseReceiptDetail.name,
				schema: WarehouseReceiptDetailSchema,
			},
		]),
		ProductsModule,
		ProductSkusModule,
	],
	providers: [WarehouseReceiptDetailsService],
	exports: [WarehouseReceiptDetailsService],
	// controllers: [WarehouseReceiptDetailsController],
})
export class WarehouseReceiptDetailsModule {}
