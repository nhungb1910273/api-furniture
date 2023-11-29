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
import { UpdateWarehouseReceipDetailtDto } from './dto/update-warehouse-receipt-details.dto';
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
			console.log('input createRWDetail', input);
			const productSku = await this.productSkuService.findOne({
				_id: input.productSku,
			});
			if (productSku) {
				const name = (Math.random() + 1000000).toString(36).substring(7);
				input.name = name;
				input.productSku = productSku._id;
				console.log('pr', input);
				const createWarehouseReceiptDetail =
					await this.warehouseReceiptDetailModel.create(input);
				if (createWarehouseReceiptDetail) {
					console.log(
						'createWarehouseReceiptDetail',
						createWarehouseReceiptDetail,
					);
					return createWarehouseReceiptDetail;
				} else {
					throw new BadRequestException('Create warehouse failed!');
				}
			}
			throw new BadRequestException('Product sku not found!');
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

	async updateQuantityProductSku(
		input: UpdateWarehouseReceipDetailtDto,
	): Promise<boolean> {
		try {
			const findProductSku = await this.productSkuService.findOne({
				_id: input.productSku,
			});
			if (findProductSku) {
				const updateProductSku = await this.productSkuService.updateOne(
					{
						quantityInStock: findProductSku.quantityInStock + input.quantity,
					},
					input.productSku,
				);
				if (updateProductSku) {
					return true;
				} else {
					throw new BadRequestException('Update Product Sku failed!');
				}
			}
			throw new BadRequestException('Product Sku not found!');
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async deleteOne(id: string): Promise<string> {
		try {
			const remove = await this.warehouseReceiptDetailModel.findOneAndRemove({
				_id: id,
			});
			if (remove) {
				return 'Success';
			} else {
				throw new BadRequestException('NO success');
			}
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
