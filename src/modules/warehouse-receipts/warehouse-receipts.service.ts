import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { SuccessResponse } from 'src/shared/response/success-response';
import { WarehouseReceiptDetailsService } from '../warehouse-receipt-details/warehouse-receipt-details.service';
import { CreateWarehouseReceiptDto } from './dto/create-warehouse-receipts.dto';
import {
	WRStatus,
	WarehouseReceipt,
	WarehouseReceiptDocument,
} from './schemas/warehouse-receipts.schema';
import { ProvidersService } from '../providers/providers.service';
import { UpdateWarehouseReceiptDto } from './dto/update-warehouse-receipts.dto';
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
			return await this.warehouseReceiptModel.findOne(filter).populate([
				{
					path: 'warehouseReceiptDetails',
					populate: {
						path: 'productSku',
						populate: [
							{ path: 'product' },
							{ path: 'optionValues', populate: 'optionSku' },
						],
					},
				},
				'user',
				'provider',
			]);
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
				.limit(limit)
				.populate([
					{
						path: 'warehouseReceiptDetails',
						populate: {
							path: 'productSku',
							populate: [
								{ path: 'product' },
								{ path: 'optionValues', populate: 'optionSku' },
							],
						},
					},
					'user',
					'provider',
				]);

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

	async createOne(input: CreateWarehouseReceiptDto): Promise<WarehouseReceipt> {
		try {
			const provider = await this.providerService.findOne({
				email: input.provider,
			});
			if (provider) {
				input.provider = provider._id;
				return this.warehouseReceiptModel.create(input);
			}
			throw new BadRequestException('Provider not found!');
		} catch (err) {
			return err;
		}
	}
	async addWRD(input: UpdateWarehouseReceiptDto): Promise<WarehouseReceipt> {
		try {
			if (input.id) {
				const findWR = await this.findOne({
					_id: input.id,
				});
				if (findWR) {
					if (
						input.warehouseReceiptDetails &&
						input.warehouseReceiptDetails.length
					) {
						const WRDetails = [];
						for (const dto of input.warehouseReceiptDetails) {
							const createRWDetail =
								await this.warehouseReceiptDetailService.create(dto);
							WRDetails.push(createRWDetail);
							console.log('createRWDetail', createRWDetail);
						}
						if (WRDetails && WRDetails.length > 0) {
							console.log('WRDetails', WRDetails);
							input.warehouseReceiptDetails = WRDetails;
							const updateWR = await this.updatOne(input, findWR._id);
							if (updateWR) {
								return updateWR;
							} else {
								throw new BadRequestException('Update WR not success!');
							}
						} else {
							throw new BadRequestException('Create WRDetail not success!');
						}
					} else {
						throw new BadRequestException(
							'Warehouse receipt detail has existed!',
						);
					}
				}
			}
			throw new BadRequestException('Id not found!');
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async updatOne(
		input: UpdateWarehouseReceiptDto,
		id: string,
	): Promise<WarehouseReceipt> {
		try {
			return await this.warehouseReceiptModel.findByIdAndUpdate(
				{
					_id: id,
				},
				input,
				{
					new: true,
				},
			);
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async updateStatus(
		input: UpdateWarehouseReceiptDto,
		id: string,
	): Promise<WarehouseReceipt> {
		try {
			if (
				input.warehouseReceiptDetails &&
				input.warehouseReceiptDetails.length
			) {
				for (const val of input.warehouseReceiptDetails) {
					await this.warehouseReceiptDetailService.updateQuantityProductSku(
						val,
					);
				}
				return await this.warehouseReceiptModel.findByIdAndUpdate(
					{
						_id: id,
					},
					{
						status: WRStatus.Approved,
					},
					{
						new: true,
					},
				);
			}
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

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

	async deleteMany(): Promise<SuccessResponse<WarehouseReceipt>> {
		try {
			await this.warehouseReceiptModel.deleteMany();
			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
