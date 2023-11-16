import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WarehouseReceiptDetailsModule } from '../warehouse-receipt-details/warehouse-receipt-details.module';
import {
	WarehouseReceipt,
	WarehouseReceiptSchema,
} from './schemas/warehouse-receipts.schema';
import { WarehouseReceiptsService } from './warehouse-receipts.service';
import { WarehouseReceiptsController } from './warehouse-receipts.controller';
import { ProvidersModule } from '../providers/providers.module';
@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: WarehouseReceipt.name,
				schema: WarehouseReceiptSchema,
			},
		]),
		WarehouseReceiptDetailsModule,
		ProvidersModule,
	],
	providers: [WarehouseReceiptsService],
	exports: [WarehouseReceiptsService],
	controllers: [WarehouseReceiptsController],
})
export class WarehouseReceiptsModule {}
