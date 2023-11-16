import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { PhotoService } from '../photos/photo.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review, ReviewDocument } from './schemas/reviews.shemas';
import { ProductsService } from '../products/products.service';
@Injectable()
export class ReviewsService {
	constructor(
		@InjectModel(Review.name)
		private reviewModel: Model<ReviewDocument>,
		private readonly photoService: PhotoService,
		private readonly productService: ProductsService,
	) {}

	async findOne(filter: Partial<Review>): Promise<Review> {
		try {
			return await this.reviewModel.findOne(filter);
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Reviews',
			);
		}
	}

	async findAll(filter: ListOptions<Review>): Promise<ListResponse<Review>> {
		try {
			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.reviewModel
				.find(filter)
				.sort(sortQuery)
				.skip(offset)
				.limit(limit)
				.populate(['user', 'product']);

			return {
				items: result,
				total: result?.length,
				options: filter,
			};
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Reviews',
			);
		}
	}
	async create(
		input: CreateReviewDto,
		files?: { photos?: Express.Multer.File[] },
	): Promise<Review> {
		try {
			const product = await this.productService.findOne({
				_id: input.product,
			});
			if (!product) {
				input.product = product._id;
				const createReview = await this.reviewModel.create(input);
				if (files.photos && files) {
					try {
						const createPhotos = await this.photoService.uploadManyFile(
							files,
							createReview._id,
						);
						createReview.photos = createPhotos.items;
						await createReview.save();
					} catch (error) {
						createReview.delete();
						throw new BadRequestException('Review creation failed');
					}
				}
				return createReview;
			}
			throw new BadRequestException('Product has existed!');
		} catch (err) {
			return err;
		}
	}

	// async createOne(input: CreateReviewDto): Promise<Review> {
	// 	try {
	// 		const user = await this.reviewModel.findOne({
	// 			name: input.name,
	// 			description: input.description,
	// 		});
	// 		if (!user) {
	// 			return this.reviewModel.create(input);
	// 		}
	// 		throw new BadRequestException('Email has existed!');
	// 	} catch (err) {
	// 		return err;
	// 	}
	// }

	// async updateOne(input: UpdateReviewDto, filter: Partial<Review>): Promise<Review> {
	// 	const { name, place, email } = input;

	// 	try {
	// 		if (name || place || email) {
	// 			return await this.reviewModel.findByIdAndUpdate(filter._id, input, {
	// 				new: true,
	// 			});
	// 		}
	// 		throw new BadRequestException('Data invalid!');
	// 	} catch (err) {
	// 		throw new BadRequestException(err);
	// 	}
	// }

	// async deleteOne({ id }: any): Promise<SuccessResponse<Review>> {
	// 	try {
	// 		if (!isValidObjectId(id)) throw new BadRequestException('ID invalid!');

	// 		await this.reviewModel.findOneAndRemove({
	// 			_id: id,
	// 		});

	// 		return;
	// 	} catch (err) {
	// 		throw new BadRequestException(err);
	// 	}
	// }

	async delete(id: string): Promise<Review> {
		const deletedReview = await this.reviewModel.findOneAndDelete({ _id: id });
		if (deletedReview) {
			deletedReview.photos.forEach(async (el) => {
				await this.photoService.delete(el._id);
			});
		}
		return deletedReview;
	}

	async caculateAverageRating(product: string): Promise<number> {
		try {
			const objectId = new Types.ObjectId(product);

			const aggregateResult = await this.reviewModel.aggregate([
				{ $match: { product: objectId } },
				{ $group: { _id: null, averageStar: { $avg: '$rating' } } },
			]);

			const averageStar =
				aggregateResult.length > 0 ? aggregateResult[0].averageStar : undefined;

			return parseFloat(averageStar.toFixed(2));
		} catch (error) {
			return undefined;
		}
	}
}
