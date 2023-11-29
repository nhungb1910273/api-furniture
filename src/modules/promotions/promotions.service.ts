import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { SuccessResponse } from 'src/shared/response/success-response';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Promotion, PromotionDocument } from './schemas/promotions.schema';
@Injectable()
export class PromotionsService {
	constructor(
		@InjectModel(Promotion.name)
		private promotionModel: Model<PromotionDocument>,
	) {}

	// async findOne(filter: Partial<Promotion>): Promise<Promotion> {
	// 	return this.promotionModel.findOne(filter);
	// }
	async findOne(filter: Partial<Promotion>): Promise<Promotion> {
		return this.promotionModel.findOne(filter);
	}
	async findAll(
		filter: ListOptions<Promotion>,
	): Promise<ListResponse<Promotion>> {
		try {
			const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
			const query: any = filter.search ? { ...filter, name: rgx(filter.search) } : { ...filter };
			if (filter.dateExpire) {
				query['dateExpire'] = { $gt: new Date() }; // Adjust the condition based on your requirements
			  }else if(filter.quantity === 0){
				query['quantity'] = { $lt: 0 }; // Adjust the condition based on your requirements
			  }else{
				query['quantity'] = { $gt: 0 }; // Adjust the condition based on your requirements

			  }
		  

			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.promotionModel
				.find(query)
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
				'An error occurred while retrieving promotion',
			);
		}
	}
	async create(input: CreatePromotionDto): Promise<Promotion> {
		try {
			const promotionPromotion = await this.promotionModel.findOne({
				couponCode: input.couponCode,
			});
			if (!promotionPromotion) {
				return await this.promotionModel.create(input);
			}
			throw new BadRequestException('Room furniture has existed!');
		} catch (err) {
			return err;
		}
	}

	// async createOne(input: CreatePromotionDto): Promise<Promotion> {
	// 	try {
	// 		const user = await this.promotionModel.findOne({
	// 			name: input.name,
	// 			description: input.description,
	// 		});
	// 		if (!user) {
	// 			return this.promotionModel.create(input);
	// 		}
	// 		throw new BadRequestException('Email has existed!');
	// 	} catch (err) {
	// 		return err;
	// 	}
	// }

	async updateOne(input: UpdatePromotionDto, id: string): Promise<Promotion> {
		try {
			console.log(input, id);
			const findPromotion = await this.findOne({
				_id: id,
			});
			if (findPromotion) {
				return await this.promotionModel.findByIdAndUpdate(
					findPromotion._id,
					input,
					{
						new: true,
					},
				);
			}

			throw new BadRequestException('Data invalid!');
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async deleteOne({ id }: any): Promise<SuccessResponse<Promotion>> {
		try {
			if (!isValidObjectId(id)) throw new BadRequestException('ID invalid!');

			await this.promotionModel.findOneAndRemove({
				_id: id,
			});

			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
