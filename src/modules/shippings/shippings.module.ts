import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShippingsService } from './shippings.service';
import { Shipping, ShippingSchema } from './schemas/shippings.schema';
import { ShippingsController } from './shippings.controller';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Shipping.name, schema: ShippingSchema },
		]),
	],
	providers: [ShippingsService],
	exports: [ShippingsService],
	controllers: [ShippingsController],
})
export class ShippingsModule {}
