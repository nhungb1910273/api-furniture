import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { SuccessResponse } from 'src/shared/response/success-response';
import { ProductSkusService } from '../product-skus/product-skus.service';
import { CreateWarehouseReceiptDetailDto } from './dto/create-warehouse-receipt-detail.dto';
import {
	WarehouseReceiptDetail,
	WarehouseReceiptDetailDocument,
} from './schemas/warehouse-receipt-details.schema';
@Injectable()
export class WarehouseReceiptDetailsService {
	constructor(
		@InjectModel(WarehouseReceiptDetail.name)
		private warehouseReceiptDetailModel: Model<WarehouseReceiptDetailDocument>,
		private readonly productSkuService: ProductSkusService,
	) {}

	async findOne(
		filter: Partial<WarehouseReceiptDetail>,
	): Promise<WarehouseReceiptDetail> {
		try {
			return await this.warehouseReceiptDetailModel.findOne(filter);
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving WarehouseReceiptDetails',
			);
		}
	}

	async findAll(
		filter: ListOptions<WarehouseReceiptDetail>,
	): Promise<ListResponse<WarehouseReceiptDetail>> {
		try {
			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.warehouseReceiptDetailModel
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
				'An error occurred while retrieving WarehouseReceiptDetails',
			);
		}
	}
	async create(
		input: CreateWarehouseReceiptDetailDto,
	): Promise<WarehouseReceiptDetail> {
		try {
			const productSku = await this.productSkuService.findOne({
				_id: input.productSku,
			});
			if (!productSku) {
				const createWarehouseReceiptDetail =
					await this.warehouseReceiptDetailModel.create(input);

				return await createWarehouseReceiptDetail.save();
			}
			throw new BadRequestException('Product sku has existed!');
		} catch (err) {
			return err;
		}
	}

	// async createOne(input: CreateWarehouseReceiptDetailDto): Promise<WarehouseReceiptDetail> {
	// 	try {
	// 		const user = await this.warehouseReceiptDetailModel.findOne({
	// 			name: input.name,
	// 			description: input.description,
	// 		});
	// 		if (!user) {
	// 			return this.warehouseReceiptDetailModel.create(input);
	// 		}
	// 		throw new BadRequestException('Email has existed!');
	// 	} catch (err) {
	// 		return err;
	// 	}
	// }

	// async updateOne(input: UpdateWarehouseReceiptDetailDto, filter: Partial<WarehouseReceiptDetail>): Promise<WarehouseReceiptDetail> {
	// 	const { name, place, email } = input;

	// 	try {
	// 		if (name || place || email) {
	// 			return await this.warehouseReceiptDetailModel.findByIdAndUpdate(filter._id, input, {
	// 				new: true,
	// 			});
	// 		}
	// 		throw new BadRequestException('Data invalid!');
	// 	} catch (err) {
	// 		throw new BadRequestException(err);
	// 	}
	// }

	async deleteOne({
		id,
	}: any): Promise<SuccessResponse<WarehouseReceiptDetail>> {
		try {
			if (!isValidObjectId(id)) throw new BadRequestException('ID invalid!');

			await this.warehouseReceiptDetailModel.findOneAndRemove({
				_id: id,
			});

			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
