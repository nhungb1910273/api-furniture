import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, isValidObjectId } from 'mongoose';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { SuccessResponse } from 'src/shared/response/success-response';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart, CartDocument } from './schemas/carts.schema';
import { UpdateCartDto } from './dto/update-cart.dto';
import { DetailCartsService } from '../detail-carts/detail-carts.service';
@Injectable()
export class CartsService {
	constructor(
		@InjectModel(Cart.name)
		private cartModel: Model<CartDocument>,
		private readonly detailCartService: DetailCartsService,
	) {}

	// async findOne(filter: Partial<Cart>): Promise<Cart> {
	// 	try {
	// 		return await this.cartModel.findOne(filter).populate('detailCarts');
	// 	} catch (error) {
	// 		throw new BadRequestException('An error occurred while retrieving Carts');
	// 	}
	// }
	async getOneByID(userId: string): Promise<Cart> {
		try {
			const objectID = new mongoose.Types.ObjectId(userId);
			const facility = await this.cartModel.aggregate([
				{ $match: { user: objectID } },
				// {
				// 	$lookup: {
				// 		from: 'users',
				// 		localField: 'reviews.accountID',
				// 		foreignField: '_id',
				// 		as: 'userReview',
				// 		pipeline: [{ $project: { displayName: 1, avatar: 1, role: 1 } }],
				// 	},
				// },
				{
					$lookup: {
						from: 'detailcarts',
						localField: 'detailCarts',
						foreignField: '_id',
						as: 'detailCarts',
					},
				},
				{ $unwind: '$detailCarts' },
				{
					$lookup: {
						from: 'productskus',
						localField: 'detailCarts.productSku',
						foreignField: '_id',
						as: 'detailCarts.productSku',
					},
				},
				{
					$unwind: '$detailCarts.productSku',
				},
				{
					$group: {
						_id: '$_id',
						detailCarts: {
							$push: '$detailCarts',
						},
					},
				},

				// {
				// 	$lookup: {
				// 		from: 'facilityschedules',
				// 		localField: 'schedule',
				// 		foreignField: '_id',
				// 		as: 'schedule',
				// 	},
				// },
				// {
				// 	$lookup: {
				// 		from: 'brands',
				// 		localField: 'brandID',
				// 		foreignField: '_id',
				// 		as: 'brandID',
				// 	},
				// },
				// { $unwind: { path: '$brandID', preserveNullAndEmptyArrays: true } },
				// {
				// 	$lookup: {
				// 		from: 'packagetypes',
				// 		localField: '_id',
				// 		foreignField: 'facilityID',
				// 		as: 'packagetype',
				// 		pipeline: [
				// 			{
				// 				$sort: { order: 1 }, // Sắp xếp theo trường price
				// 			},
				// 		],
				// 	},
				// },
				// {
				// 	$project: {
				// 		_id: 1,
				// 		brandID: 1,
				// 		name: 1,
				// 		address: 1,
				// 		fullAddress: 1,
				// 		summary: 1,
				// 		description: 1,
				// 		location: 1,
				// 		state: 1,
				// 		photos: 1,
				// 		schedule: 1,
				// 		facilityCategoryID: 1,
				// 		updatedAt: 1,
				// 		createdAt: 1,
				// 		packages: 1,
				// 		averageStar: 1,
				// 		packagetype: 1,
				// 		reviews: {
				// 			$map: {
				// 				input: '$reviews',
				// 				as: 'review',
				// 				in: {
				// 					$mergeObjects: [
				// 						'$$review',
				// 						{
				// 							accountID: {
				// 								$arrayElemAt: [
				// 									'$userReview',
				// 									{
				// 										$indexOfArray: [
				// 											'$userReview._id',
				// 											'$$review.accountID',
				// 										],
				// 									},
				// 								],
				// 							},
				// 						},
				// 					],
				// 				},
				// 			},
				// 		},
				// 	},
				// },
			]);

			return facility[0] || null;
		} catch (error) {
			console.log('Error: ', error);
			throw new BadRequestException(
				'An error occurred while retrieving facility',
			);
		}
	}

	async findAll(filter: ListOptions<Cart>): Promise<ListResponse<Cart>> {
		try {
			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.cartModel
				.find(filter)
				.sort(sortQuery)
				.skip(offset)
				.limit(limit)
				.populate('detailCarts');

			return {
				items: result,
				total: result?.length,
				options: filter,
			};
		} catch (error) {
			throw new BadRequestException('An error occurred while retrieving Carts');
		}
	}
	async create(input: CreateCartDto): Promise<Cart> {
		try {
			if (input.user) {
				const createCart = await this.cartModel.create(input);
				if (createCart) {
					return createCart;
				} else {
					throw new BadRequestException('Create cart failed!');
				}
			}

			throw new BadRequestException('Cart has existed!');
		} catch (err) {
			return err;
		}
	}

	async addCartItem(input: UpdateCartDto, userId: string): Promise<Cart> {
		try {
			const findCart = await this.cartModel.findOne({ user: userId });

			const findCartPopulate = await this.cartModel
				.findOne({ user: userId })
				.populate('detailCarts');
			// input: [1,2, 3] : the most fill (follow)
			// find cart: [1,2,3,4,5]
			const resultDiff = findCartPopulate.detailCarts.filter(
				({ productSku: productSku }) =>
					!input.detailCarts.some(
						({ productSku: productSku1 }) =>
							productSku1 === productSku.toString(),
					),
			);
			if (resultDiff) {
				for (const val of resultDiff) {
					await this.detailCartService.deleteOne({
						id: val._id,
					});
				}
			}
			// compare input and in cart => duplication
			const resultDup = findCartPopulate.detailCarts.filter(
				({ productSku: productSku }) =>
					input.detailCarts.some(
						({ productSku: productSku1 }) =>
							productSku1 === productSku.toString(),
					),
			);

			if (findCart && input.detailCarts) {
				const cartItemNewIds = [];
				for (const val of input.detailCarts) {
					const findCartItem = await this.detailCartService.findOne({
						productSku: val.productSku,
					});
					if (!findCartItem) {
						const name = (Math.random() + 1000000).toString(36).substring(7);
						const createCartItem = await this.detailCartService.create({
							...val,
							name: name,
						});
						if (createCartItem._id) {
							cartItemNewIds.push(createCartItem._id.toString());
						} else {
							throw new BadRequestException('Create cart item failed!');
						}
					} else {
						console.log('trung');
						await this.detailCartService.updateOne(val, val.productSku);
					}
				}
				if (cartItemNewIds.length > 0) {
					const updateCart = await this.updateOne(findCart._id, {
						totalPrice: input.totalPrice,
						detailCarts: [...resultDup, ...cartItemNewIds],
					});

					if (updateCart) {
						return updateCart;
					} else {
						for (const val of cartItemNewIds) {
							await this.detailCartService.deleteOne(val);
						}
					}
				} else {
					const result = resultDup.reduce((value, current) => {
						return value.concat(current._id.toString());
					}, []);
					const updateCart = await this.updateOne(findCart._id, {
						totalPrice: input.totalPrice,
						detailCarts: result,
					});
					if (updateCart) {
						return updateCart;
					} else {
						for (const val of cartItemNewIds) {
							await this.detailCartService.deleteOne(val);
						}
					}
				}
			} else {
				return await this.updateOne(findCart._id, input);
			}
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async updateOne(id: string, input: UpdateCartDto): Promise<Cart> {
		try {
			const cart = await this.cartModel.findByIdAndUpdate(id, input, {
				new: true,
			});
			if (!cart) throw new NotFoundException('Product not found');
			return cart;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async deleteOne({ id }: any): Promise<SuccessResponse<Cart>> {
		try {
			if (!isValidObjectId(id)) throw new BadRequestException('ID invalid!');
			const findCart = await this.cartModel
				.findOne({
					_id: id,
				})
				.populate('detailCarts');
			if (findCart)
				for (const val of findCart.detailCarts) {
					await this.detailCartService.deleteOne(val._id);
				}
			await this.cartModel.findOneAndRemove({
				_id: id,
			});

			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async deleteMany(): Promise<SuccessResponse<Cart>> {
		try {
			await this.cartModel.deleteMany();
			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
