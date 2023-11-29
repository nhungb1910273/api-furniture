import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { PhotoService } from '../photos/photo.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review, ReviewDocument } from './schemas/reviews.shemas';
import { UpdateReviewDto } from './dto/update-review.dto';
@Injectable()
export class ReviewsService {
	constructor(
		@InjectModel(Review.name)
		private reviewModel: Model<ReviewDocument>,
		private readonly photoService: PhotoService, // private readonly productSkuService: ProductSkusService,
	) {}

	async findOne(filter: Partial<Review>): Promise<Review> {
		try {
			return await this.reviewModel.findOne(filter).populate([
				'user',
				{
					path: 'productSku',
					populate: [
						{ path: 'product' },
						{ path: 'optionValues', populate: { path: 'optionSku' } },
					],
				},
				'product',
				'bill',
			]);
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Reviews',
			);
		}
	}

	async findAll(filter: ListOptions<Review>): Promise<ListResponse<Review>> {
		try {
			const rgx = (pattern) => new RegExp(`.*${pattern}.*`);

			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.reviewModel
				.find(filter.search ? { ...filter, name: rgx(filter.search) } : filter)
				.sort(sortQuery)
				.skip(offset)
				.limit(limit)
				.populate([
					'user',
					{
						path: 'productSku',
						populate: [
							{ path: 'product' },
							{ path: 'optionValues', populate: { path: 'optionSku' } },
						],
					},
					'product',
					'bill',
				]);

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

	async calculateAverageRating(filter: ListOptions<Review>): Promise<number> {
		const reviews = await this.reviewModel.find(filter).exec();

		if (!reviews || reviews.length === 0) {
			return 0; // Return 0 if there are no reviews
		}

		const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
		const averageRating = totalRating / reviews.length;

		return averageRating;
	}

	async create(
		input: CreateReviewDto,
		files?: { photos?: Express.Multer.File[] },
	): Promise<Review> {
		try {
			console.log(input);
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
			console.log('createdReview', createReview);
			return createReview;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async updateOne(
		id: string,
		input: UpdateReviewDto,
		files?: { photoUpdates?: Express.Multer.File[] },
	): Promise<Review> {
		try {
			const findPhoto = await this.reviewModel.findOne({
				_id: id,
			});
			if (findPhoto && input.photos) {
				for (const val of input.photos) {
					const arr = findPhoto.photos.filter((item) => item._id !== val._id);
					if (arr.length) {
						await this.photoService.delete(val._id);
					}
				}
			}
			if (files && files.photoUpdates) {
				const createPhotos = await this.photoService.uploadManyFile(files, id);
				// console.log('createPhotos', createPhotos);
				if (createPhotos.total !== 0) {
					input.photos = [...input.photos, ...createPhotos.items];
				}
			}
			const updateReview = await this.reviewModel.findByIdAndUpdate(id, input, {
				new: true,
				runValidators: true,
			});
			if (!updateReview) throw new NotFoundException('Product not found');
			return updateReview;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async updateStatus(input: UpdateReviewDto, id: string): Promise<Review> {
		try {
			const updateBlog = await this.reviewModel.findOneAndUpdate(
				{ _id: id },
				{
					status: input.status,
				},
				{
					new: true,
				},
			);
			if (!updateBlog) throw new NotFoundException('Product not found');
			return updateBlog;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

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
