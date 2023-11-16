import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { ESortField, ESortOrder } from 'src/shared/enum/sort.enum';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { SuccessResponse } from 'src/shared/response/success-response';
import { CategoriesService } from '../categories/categories.service';
import { RoomFurnituresService } from '../room-furnitures/room-furnitures.service';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductDto } from './dto/get-product-dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/products.schema';
import { SkuValuesService } from '../sku-values/sku-values.service';
import { ProductSkusService } from '../product-skus/product-skus.service';

@Injectable()
export class ProductsService {
	constructor(
		@InjectModel(Product.name)
		private productModel: Model<ProductDocument>,
		private roomFurnitureService: RoomFurnituresService,
		private categoryService: CategoriesService,
		private skuValueService: SkuValuesService,
		private productSkuService: ProductSkusService,
	) {}

	async findOne(filter: Partial<Product>): Promise<Product> {
		try {
			return await this.productModel.findOne(filter);
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Products',
			);
		}
	}

	async findOneProduct(id: string): Promise<Product> {
		try {
			return await this.productModel
				.findOne({
					_id: id,
				})
				.populate(['productSkus', 'category', 'roomFurniture', 'skuValues']);
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Products',
			);
		}
	}

	async count(filter: any): Promise<number> {
		const result: number = await this.productModel.count({
			$and: filter,
		});
		return result || 0;
	}

	async queryAggregate(
		filter: any,
		paginate: any,
		pipes: any[],
		secondSortField?: ESortField,
	): Promise<Product[]> {
		const { sortField, sortOrder, offset, limit } = paginate;
		let secondSort = '_id';
		const sortOrderNumber = sortOrder === ESortOrder.DESC ? -1 : 1;
		if (secondSortField) {
			secondSort = secondSortField;
		}
		const result = await this.productModel.aggregate([
			{
				$match: { $and: filter },
			},
			// ...joinUser('createdBy'),
			// ...joinUser('updatedBy'),
			...pipes,
			{
				$project: {
					password: 0,
					key: 0,
				},
			},
			{
				$sort: {
					[sortField]: sortOrderNumber,
					[secondSort]: -1,
				},
			},
			{
				$limit: offset + limit,
			},
			{
				$skip: offset,
			},
		]);
		return result;
	}
	async findAllByFields(
		input: GetProductDto,
	): Promise<SuccessResponse<Product>> {
		try {
			const { searchField, searchValue, ...paginating } = input;
			console.log(searchField, searchValue);
			const filter = [{}];
			const pipes = [];

			if (searchField) {
				filter.push({
					[searchField]: { $regex: searchValue, $options: 'i' },
				});
			}
			console.log('FILTER', filter);

			const [count, data] = await Promise.all([
				this.count(filter),
				this.queryAggregate(filter, paginating, pipes),
			]);

			if (data) {
				return {
					filter: input,
					total: count,
					data,
				};
			}
			return;
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Product',
			);
		}
	}

	async findAllProduct(
		filter: ListOptions<Product>,
	): Promise<ListResponse<Product>> {
		try {
			let input = {} as any;
			const rgx = (pattern) => new RegExp(`.*${pattern}.*`);

			if (filter.cat && filter.search) {
				input = {
					...filter,
					$and: [
						{ category: filter.cat },
						{
							name: { $regex: rgx(filter.search), $options: 'i' },
						},
					],
				};
			} else if (filter.room && filter.search) {
				input = {
					...filter,
					$and: [
						{ roomFurniture: filter.room },
						{
							name: { $regex: rgx(filter.search), $options: 'i' },
						},
					],
				};
			} else if (filter.room) {
				input = {
					...filter,
					roomFurniture: filter.room,
				};
			} else if (filter.cat) {
				input = {
					...filter,
					category: filter.cat,
				};
			} else {
				input = {
					...filter,
					name: { $regex: rgx(filter.search), $options: 'i' },
				};
			}
			console.log(input);

			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.productModel
				.find(input)
				.sort(sortQuery)
				.skip(offset)
				.limit(limit)
				.populate(['productSkus', 'category', 'roomFurniture']);

			return {
				items: result,
				total: result?.length,
				options: filter,
			};
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Products',
			);
		}
	}
	async findMany(
		// filter: GetProductDto,
		filter: ListOptions<Product>,
	): Promise<ListResponse<Product>> {
		try {
			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.productModel
				.find(
					filter.search
						? {
								...filter,
								name: { $regex: filter.search, $options: 'i' },
						  }
						: filter,
				)
				.sort(sortQuery)
				.skip(offset)
				.limit(limit)
				.populate(['productSkus', 'category', 'roomFurniture', 'skuValues']);

			return {
				items: result,
				total: result?.length,
				options: filter,
			};
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Products',
			);
		}
	}

	async createProduct(input: CreateProductDto): Promise<Product> {
		try {
			const findProduct = await this.productModel.findOne({
				name: input.name,
			});
			if (!findProduct) {
				const findCat = await this.categoryService.findOne({
					_id: input.category,
				});
				const findRoom = await this.roomFurnitureService.findOne({
					_id: input.roomFurniture,
				});
				if (findCat && findRoom) {
					const arr = findCat.roomFurnitures.filter(
						(item) => item._id !== findRoom._id,
					);
					if (arr) {
						input.category = findCat._id;
						input.roomFurniture = findRoom._id;
						const createProduct = await this.productModel.create(input);
						const createOptionNull =
							await this.skuValueService.createManyOptionNull(input.skuValues);

						if (createOptionNull.total !== 0) {
							createProduct.skuValues = createOptionNull.items;
							return await createProduct.save();
						} else {
							await this.productModel.deleteOne({
								_id: createProduct._id,
							});
						}
					} else {
						throw new BadRequestException(
							'Category has exited in Room Furniture!',
						);
					}
				} else {
					throw new BadRequestException(
						'Category or Room furniture, Brand has exited!',
					);
				}
			}
			throw new BadRequestException('Product has exited!');
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async updateProduct(
		input: UpdateProductDto,
		productID: string,
	): Promise<Product> {
		try {
			const product = await this.productModel.findOneAndUpdate(
				{ _id: productID },
				input,
				{
					new: true,
				},
			);
			if (!product) throw new NotFoundException('Product not found');
			return await product.save();
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async updateProductFavorite(
		input: UpdateProductDto,
		productID: string,
	): Promise<Product> {
		try {
			const product = await this.productModel.findOneAndUpdate(
				{ _id: productID },
				{
					isFavorite: input.isFavorite,
				},
				{
					new: true,
				},
			);
			if (!product) throw new NotFoundException('Product not found');
			return await product.save();
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async deleteOne({ id }: any): Promise<SuccessResponse<Product>> {
		try {
			if (!isValidObjectId(id))
				throw new BadRequestException('ID invalid Product!');
			const findProductSku = await this.productSkuService.findAllByProduct(
				{},
				id,
			);
			if (findProductSku && findProductSku.items) {
				for (const val of findProductSku.items) {
					if (val._id.toString()) {
						await this.productSkuService.deleteOne(val._id.toString());
					}
				}
			}
			await this.productModel.findOneAndRemove({
				_id: id,
			});

			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async deleteMany(): Promise<SuccessResponse<Product>> {
		try {
			await this.productModel.deleteMany();
			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
