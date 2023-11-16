import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { SkuValue, SkuValueDocument } from './schemas/sku-values.schemas';
import { CreateSkuValueDto } from './dto/create-sku-value.dto';
import { OptionsService } from '../options/options.service';
import { OptionValuesService } from '../option-values/option-values.service';
import { SuccessResponse } from 'src/shared/response/success-response';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { OptionNull, OptionNullDocument } from './schemas/option-null.schema';
import { CreateOptionNullDto } from './dto/create-option-null.dto';
@Injectable()
export class SkuValuesService {
	constructor(
		@InjectModel(SkuValue.name)
		private skuValueModel: Model<SkuValueDocument>,
		@InjectModel(OptionNull.name)
		private optionNullModel: Model<OptionNullDocument>,

		private optionService: OptionsService,
		private optionValueService: OptionValuesService,
	) {}

	async findOne(filter: Partial<SkuValue>): Promise<SkuValue> {
		try {
			return await this.skuValueModel
				.findOne(filter)
				.populate(['optionSku', 'optionValue']);
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Products',
			);
		}
	}

	async findOneOptionNull(filter: Partial<OptionNull>): Promise<OptionNull> {
		try {
			return await this.optionNullModel
				.findOne(filter)
				.populate(['optionSku', 'optionValues']);
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Products',
			);
		}
	}
	async findAll(
		// filter: DefaultListDto,
		filter: ListOptions<SkuValue>,
	): Promise<ListResponse<SkuValue>> {
		try {
			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === 'asc' ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.skuValueModel
				.find(filter)
				.sort(sortQuery)
				.skip(offset)
				.limit(limit);

			return {
				items: result,
				total: result?.length || 0,
				options: filter,
			};
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async createOptionNull(input: CreateOptionNullDto): Promise<OptionNull> {
		try {
			const createOptionNull = await this.optionNullModel.create(input);
			if (createOptionNull) {
				return createOptionNull;
			} else {
				throw new BadRequestException('Create option Null failed');
			}
		} catch (error) {
			throw new BadRequestException(error);
		}
	}
	async createManyOptionNull(
		input: CreateOptionNullDto[],
	): Promise<ListResponse<OptionNull>> {
		let data: OptionNull[] = [];
		try {
			const uploadPromises: Promise<OptionNull>[] = [];
			if (input.length > 0) {
				for (const value of input) {
					const uploadPromise = this.createOptionNull(value);
					uploadPromises.push(uploadPromise);
				}
				data = await Promise.all(uploadPromises);
			}
		} catch (err) {
			throw new BadRequestException('Create sku value failed');
		}
		return {
			items: data,
			total: data.length,
			options: {},
		};
	}
	async create(input: CreateSkuValueDto): Promise<SkuValue> {
		try {
			const findOptionValue = await this.optionValueService.findOne({
				_id: input.optionValue,
			});
			const findOption = await this.optionService.findOne({
				_id: input.optionSku,
			});
			const skuValue = await this.skuValueModel.findOne({
				optionSku: input.optionSku,
				optionValue: input.optionValue,
			});
			if (skuValue) {
				return skuValue;
			} else {
				if (findOption && findOptionValue) {
					const find = await this.optionValueService.findOne({
						optionSku: findOption,
					});
					// value has exist in option
					if (find._id) {
						input.optionSku = findOption._id;
						input.optionValue = findOptionValue._id;
						return await this.skuValueModel.create(input);
					} else {
						throw new BadRequestException('Option value invalid!');
					}
				} else {
					throw new BadRequestException('Option or option value has existed!');
				}
			}
		} catch (err) {
			return err;
		}
	}

	async createMany(
		input: CreateSkuValueDto[],
	): Promise<ListResponse<SkuValue>> {
		let data: SkuValue[] = [];
		try {
			const uploadPromises: Promise<SkuValue>[] = [];
			if (input.length > 0) {
				for (const value of input) {
					const uploadPromise = this.create(value);
					uploadPromises.push(uploadPromise);
				}
				data = await Promise.all(uploadPromises);
			}
		} catch (err) {
			throw new BadRequestException('Create sku value failed');
		}
		return {
			items: data,
			total: data.length,
			options: {},
		};
	}

	async deleteOne(id: string): Promise<SuccessResponse<SkuValue>> {
		try {
			// const find = await this.skuValueService.
			await this.skuValueModel.findOneAndRemove({
				_id: id,
			});

			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async deleteMany(): Promise<SuccessResponse<SkuValue>> {
		try {
			await this.skuValueModel.deleteMany();

			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
