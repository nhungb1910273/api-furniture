import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { SuccessResponse } from 'src/shared/response/success-response';
import { WarehouseReceiptDetailsService } from '../warehouse-receipt-details/warehouse-receipt-details.service';
import { CreateWarehouseReceiptDto } from './dto/create-warehouse-receipts.dto';
import {
	WarehouseReceipt,
	WarehouseReceiptDocument,
} from './schemas/warehouse-receipts.schema';
import { ProvidersService } from '../providers/providers.service';
@Injectable()
export class WarehouseReceiptsService {
	constructor(
		@InjectModel(WarehouseReceipt.name)
		private warehouseReceiptModel: Model<WarehouseReceiptDocument>,
		private readonly warehouseReceiptDetailService: WarehouseReceiptDetailsService,
		private readonly providerService: ProvidersService,
	) {}

	async findOne(filter: Partial<WarehouseReceipt>): Promise<WarehouseReceipt> {
		try {
			return await this.warehouseReceiptModel.findOne(filter);
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving WarehouseReceipts',
			);
		}
	}

	async findAll(
		filter: ListOptions<WarehouseReceipt>,
	): Promise<ListResponse<WarehouseReceipt>> {
		try {
			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.warehouseReceiptModel
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
				'An error occurred while retrieving WarehouseReceipts',
			);
		}
	}
	async create(input: CreateWarehouseReceiptDto): Promise<WarehouseReceipt> {
		try {
			const provider = await this.providerService.findOneById({
				_id: input.provider,
			});
			if (!provider) {
				const createWarehouseReceipt = await this.warehouseReceiptModel.create(
					input,
				);
				const WRDetails = [];
				if (
					input.warehouseReceiptDetails &&
					input.warehouseReceiptDetails.length
				) {
					for (const dto of input.warehouseReceiptDetails) {
						const createRWDetail =
							await this.warehouseReceiptDetailService.create(dto);
						WRDetails.push(createRWDetail);
					}
					console.log('WRDetails', WRDetails);
					createWarehouseReceipt.warehouseReceiptDetails = WRDetails;
					await createWarehouseReceipt.save();
					return createWarehouseReceipt;
				} else {
					throw new BadRequestException(
						'Warehouse receipt detail has existed!',
					);
				}
			}
			throw new BadRequestException('Provider has existed!');
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	// async createOne(input: CreateWarehouseReceiptDto): Promise<WarehouseReceipt> {
	// 	try {
	// 		const user = await this.warehouseReceiptModel.findOne({
	// 			name: input.name,
	// 			description: input.description,
	// 		});
	// 		if (!user) {
	// 			return this.warehouseReceiptModel.create(input);
	// 		}
	// 		throw new BadRequestException('Email has existed!');
	// 	} catch (err) {
	// 		return err;
	// 	}
	// }

	// async updateOne(input: UpdateWarehouseReceiptDto, filter: Partial<WarehouseReceipt>): Promise<WarehouseReceipt> {
	// 	const { name, place, email } = input;

	// 	try {
	// 		if (name || place || email) {
	// 			return await this.warehouseReceiptModel.findByIdAndUpdate(filter._id, input, {
	// 				new: true,
	// 			});
	// 		}
	// 		throw new BadRequestException('Data invalid!');
	// 	} catch (err) {
	// 		throw new BadRequestException(err);
	// 	}
	// }

	async deleteOne({ id }: any): Promise<SuccessResponse<WarehouseReceipt>> {
		try {
			if (!isValidObjectId(id)) throw new BadRequestException('ID invalid!');

			await this.warehouseReceiptModel.findOneAndRemove({
				_id: id,
			});

			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
