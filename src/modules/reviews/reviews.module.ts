import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schemas/reviews.shemas';
import { PhotoModule } from '../photos/photo.module';
import { ReviewsService } from './reviews.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),

		// MongooseModule.forFeatureAsync([
		// 	{
		// 		name: Review.name,
		// 		useFactory: ReviewSchemaFactory,
		// 		inject: [],
		// 		imports: [],
		// 	},
		// ]),
		PhotoModule,
	],
	controllers: [ReviewsController],
	providers: [ReviewsService],
	exports: [ReviewsService],
})
export class ReviewsModule {}
