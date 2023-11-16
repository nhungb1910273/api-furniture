import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { DetailCart, DetailCartDocument } from './schemas/detail-carts.schema';
import { CreateDetailCartDto } from './dto/create-detail-cart.dto';
import { SuccessResponse } from 'src/shared/response/success-response';
import { UpdateDetailCartDto } from './dto/update-detail-cart.dto';

@Injectable()
export class DetailCartsService {
	constructor(
		@InjectModel(DetailCart.name)
		private detailCartModel: Model<DetailCartDocument>,
	) {}

	async findOne(filter: Partial<DetailCart>): Promise<DetailCart> {
		return this.detailCartModel.findOne(filter);
	}

	async findOneById(filter: ListOptions<DetailCart>): Promise<DetailCart> {
		try {
			const data = await this.detailCartModel
				.findById({
					_id: filter._id,
				})
				.populate('productSku');

			return data;
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Categorys',
			);
		}
	}

	async findOneByProductSku(filter: Partial<DetailCart>): Promise<DetailCart> {
		try {
			return await this.detailCartModel.findOne(filter);
		} catch (error) {
			throw new BadRequestException('An error occurred while retrieving Carts');
		}
	}

	async findAll(
		filter: ListOptions<DetailCart>,
	): Promise<ListResponse<DetailCart>> {
		try {
			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.detailCartModel
				.find(filter)
				.sort(sortQuery)
				.skip(offset)
				.limit(limit);
			return {
				items: result,
				total: result?.length,
				options: filter,
			};
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Colors',
			);
		}
	}

	async create(input: CreateDetailCartDto): Promise<DetailCart> {
		try {
			console.log(input);
			const detailCart = await this.detailCartModel.findOne({
				name: input.name,
			});
			if (!detailCart) {
				return await this.detailCartModel.create(input);
			}
			throw new BadRequestException('Group Permission has existed!');
		} catch (err) {
			return err;
		}
	}

	async updateOne(input: UpdateDetailCartDto, id: string): Promise<DetailCart> {
		try {
			const findDetailCart = await this.detailCartModel.findOne({
				productSku: id,
			});
			if (findDetailCart) {
				const updateDetailCart = await this.detailCartModel.findOneAndUpdate(
					{ _id: findDetailCart._id },
					input,
					{
						new: true,
					},
				);
				if (!updateDetailCart) throw new NotFoundException('Product not found');
				return updateDetailCart;
			}
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
	async deleteOne({ id }: any): Promise<boolean> {
		try {
			// const findDetailCart = await this.detailCartModel.findOne({
			// 	productSku: id,
			// });
			// console.log(findDetailCart);

			if (!isValidObjectId(id)) return false;

			await this.detailCartModel.findOneAndRemove({
				_id: id,
			});

			return true;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async deleteMany(): Promise<SuccessResponse<DetailCart>> {
		try {
			await this.detailCartModel.deleteMany();
			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
