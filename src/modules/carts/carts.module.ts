import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { Cart, CartSchema } from './schemas/carts.schema';
import { DetailCartsModule } from '../detail-carts/detail-carts.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
		DetailCartsModule,
	],
	providers: [CartsService],
	exports: [CartsService],
	controllers: [CartsController],
})
export class CartsModule {}
