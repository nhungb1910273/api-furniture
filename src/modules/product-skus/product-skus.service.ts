import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { SuccessResponse } from 'src/shared/response/success-response';
import { OptionValuesService } from '../option-values/option-values.service';
import { PhotoService } from '../photos/photo.service';
import { CreateReviewDto } from '../reviews/dto/create-review.dto';
import { ReviewsService } from '../reviews/reviews.service';
import { SkuValuesService } from '../sku-values/sku-values.service';
import { CreateProductSkuDto } from './dto/create-product-sku.dto';
import { UpdateProductSkuDto } from './dto/update-product-sku.dto';
import { ProductSku, ProductSkuDocument } from './schemas/product-skus.schemas';
@Injectable()
export class ProductSkusService {
	constructor(
		@InjectModel(ProductSku.name)
		private productSkuModel: Model<ProductSkuDocument>,
		private photoService: PhotoService,
		private skuValueService: SkuValuesService,
		private reviewService: ReviewsService,
		private optionValueService: OptionValuesService,
	) {}

	async findOne(filter: Partial<ProductSku>): Promise<ProductSku> {
		try {
			return await this.productSkuModel
				.findOne({
					_id: filter._id,
				})
				.populate([
					{
						path: 'optionValues',
						populate: { path: 'optionSku' }, // Populate the 'user' field in each comment
					},
					'product',
					{
						path: 'reviews',
						populate: ['bill', 'user'],
					},
				]);
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Options',
			);
		}
	}

	async findOneByOne(filter: Partial<ProductSku>): Promise<ProductSku> {
		try {
			return await this.productSkuModel.findOne({
				_id: filter._id,
			});
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Options',
			);
		}
	}

	async findOneByNumberSku(filter: Partial<ProductSku>): Promise<ProductSku> {
		try {
			return await this.productSkuModel
				.findOne({
					numberSKU: filter.numberSKU,
				})
				.populate([
					{
						path: 'optionValues',
						populate: { path: 'optionSku' }, // Populate the 'user' field in each comment
					},
					'product',
					{
						path: 'reviews',
						populate: ['bill', 'user'],
					},
				]);
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Options',
			);
		}
	}

	async findAllByProduct(
		filter: ListOptions<ProductSku>,
		id: string,
	): Promise<ListResponse<ProductSku>> {
		try {
			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.productSkuModel
				.find({ filter, product: id })
				.sort(sortQuery)
				.skip(offset)
				.limit(limit)
				.populate([
					{
						path: 'optionValues',
						populate: { path: 'optionSku' }, // Populate the 'user' field in each comment
					},
					'product',
					{
						path: 'reviews',
						populate: ['bill', 'user'],
					},
				]);

			return {
				items: result,
				total: result?.length,
				options: filter,
			};
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Options',
			);
		}
	}

	async findAll(
		filter: ListOptions<ProductSku>,
	): Promise<ListResponse<ProductSku>> {
		try {
			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.productSkuModel
				.find(filter)
				.sort(sortQuery)
				.skip(offset)
				.limit(limit)
				.populate([
					{
						path: 'optionValues',
						populate: { path: 'optionSku' }, // Populate the 'user' field in each comment
					},
					'product',
					{
						path: 'reviews',
						populate: ['bill', 'user'],
					},
				]);

			return {
				items: result,
				total: result?.length,
				options: filter,
			};
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Options',
			);
		}
	}
	async create(
		input: CreateProductSkuDto,
		files?: { photos?: Express.Multer.File[] },
	): Promise<ProductSku> {
		try {
			console.log('input', files, input);
			const findProductSku = await this.productSkuModel.findOne({
				numberSKU: input.numberSKU,
			});
			if (!findProductSku) {
				const optionValuesIDs = [];
				if (input.optionValues && input.optionValues.length) {
					for (const optionValueID of input.optionValues) {
						const fintOptionValue = await this.optionValueService.findOne({
							_id: optionValueID,
						});
						if (!fintOptionValue) {
							throw new BadRequestException('Option Value not found');
						}
						optionValuesIDs.push(fintOptionValue._id);
					}
					input.optionValues = optionValuesIDs;

					const createProductSku = await this.productSkuModel.create(input);
					if (files.photos && files) {
						const createPhotos = await this.photoService.uploadManyFile(
							files,
							createProductSku._id,
						);
						if (createPhotos.total !== 0) {
							createProductSku.photos = createPhotos.items;
						} else {
							await this.productSkuModel.findByIdAndRemove(
								createProductSku._id,
							);
							throw new BadRequestException('Photo not successfully!');
						}
					}
					console.log('create', createProductSku);

					return await createProductSku.save();
				} else {
					throw new BadRequestException('Photos not found!');
				}

				// if (input.skuValues && input.skuValues.length > 0) {
				// 	const createSkuValues = await this.skuValueService.createMany(
				// 		input.skuValues,
				// 	);
				// 	if (createSkuValues) {
				// 		const createProductSku = await this.productSkuModel.create(input);
				// 		createProductSku.skuValues = createSkuValues.items;

				// 		if (files.photos && files) {
				// 			const createPhotos = await this.photoService.uploadManyFile(
				// 				files,
				// 				createProductSku._id,
				// 			);
				// 			if (createPhotos.total !== 0) {
				// 				createProductSku.photos = createPhotos.items;
				// 			} else {
				// 				await this.productSkuModel.findByIdAndRemove(
				// 					createProductSku._id,
				// 				);
				// 				throw new BadRequestException('Photo not successfully!');
				// 			}
				// 		}

				// 		return await createProductSku.save();
				// 	}
				// } else {
				// 	throw new BadRequestException('Product sku not successfully!');
				// }
			}
			throw new BadRequestException('Product sku has existed!');
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async addReview(
		id: string,
		reviewDto: CreateReviewDto,
		files?: { photos?: Express.Multer.File[] },
	): Promise<ProductSku> {
		const createdReview = await this.reviewService.create(reviewDto, files);

		const averageStar = await this.reviewService.caculateAverageRating(id);

		const findProductSku = await this.findOne({
			_id: id,
		});
		if (
			findProductSku &&
			findProductSku.reviews &&
			findProductSku.reviews.length > 0
		) {
			return this.productSkuModel.findOneAndUpdate(
				{ _id: id },
				{
					reviews: [
						...findProductSku.reviews.map((item) => item._id),
						createdReview._id,
					],
				},
				// 	$set: {
				// 		averageStar: averageStar,
				// 	},
				// },
				{ new: true },
			);
		}
		return this.productSkuModel.findOneAndUpdate(
			{ _id: id },
			// {
			{
				reviews: createdReview._id,
			},
			// $set: {
			// 	averageStar: averageStar,
			// },
			// },
			{ new: true },
		);
	}

	async updateOne(
		input: UpdateProductSkuDto,
		id: string,
		files?: { photoUpdates?: Express.Multer.File[] },
	): Promise<ProductSku> {
		try {
			console.log(files, input);
			// const findPhoto = await this.photoService.findAll({});
			const findPhoto = await this.productSkuModel.findOne({
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
			const productDetail = await this.productSkuModel.findOneAndUpdate(
				{ _id: id },
				input,
				{
					new: true,
				},
			);
			if (productDetail) {
				// const findPKs = await this.findAllByProduct(
				// 	{},
				// 	productDetail.product.toString(),
				// );
				// findPKs.items.forEach((val)=> {
				// 	const data = val.optionValues.filter((item)=> item._id === )
				// })
				return productDetail;
			} else {
				throw new NotFoundException('Product not found');
			}
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async deleteOneByProduct({ id }: any): Promise<SuccessResponse<ProductSku>> {
		try {
			if (!isValidObjectId(id)) throw new BadRequestException('ID invalid!');
			// const find = await this.productSkuModel.findOne({
			// 	_id: id,
			// });
			// for (const val of find.skuValues) {
			// 	await this.skuValueService.deleteOne(val._id.toString());
			// }
			await this.productSkuModel.findOneAndRemove({
				productSku: id,
			});

			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async deleteOne(id: string): Promise<string> {
		const productSku = await this.productSkuModel.findByIdAndDelete(id);
		if (!productSku) {
			throw new NotFoundException('ProductSku not found');
		}
		return 'Delete ProductSku successful';
	}
	async deleteMany(): Promise<SuccessResponse<ProductSku>> {
		try {
			await this.productSkuModel.deleteMany();

			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
