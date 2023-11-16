import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Promotion, PromotionSchema } from './schemas/promotions.schema';
import { PromotionsController } from './promotions.controller';
import { PromotionsService } from './promotions.service';
@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Promotion.name, schema: PromotionSchema },
		]),
	],
	providers: [PromotionsService],
	exports: [PromotionsService],
	controllers: [PromotionsController],
})
export class PromotionsModule {}
