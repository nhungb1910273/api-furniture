import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BillsService } from './bills.service';
import { Bill, BillSchema } from './schemas/bills.schema';
import { BillsController } from './bills.controller';
import { BillItemsModule } from '../bill-items/bill-items.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Bill.name, schema: BillSchema }]),
		BillItemsModule,
	],
	providers: [BillsService],
	exports: [BillsService],
	controllers: [BillsController],
})
export class BillsModule {}
