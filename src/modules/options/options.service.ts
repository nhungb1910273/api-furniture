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
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { Option, OptionDocument } from './schemas/options.schema';
@Injectable()
export class OptionsService {
	constructor(
		@InjectModel(Option.name)
		private optionModel: Model<OptionDocument>,
	) {}

	async findOne(filter: Partial<Option>): Promise<Option> {
		return this.optionModel.findOne(filter).populate('optionValues');
	}

	async findAll(filter: ListOptions<Option>): Promise<ListResponse<Option>> {
		try {
			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.optionModel
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
				.populate('optionValues');

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
	async create(input: CreateOptionDto): Promise<Option> {
		try {
			const option = await this.optionModel.findOne({
				name: input.name,
			});
			// const displayOption = await this.displayOptionService.findOne({
			// 	_id: input.displayOption,
			// });
			if (!option) {
				return await this.optionModel.create(input);
			}
			throw new BadRequestException('Option has existed!');
		} catch (err) {
			return err;
		}
	}

	async updateOne(input: UpdateOptionDto, id: string): Promise<Option> {
		try {
			const findOption = await this.optionModel.findOne({
				_id: id,
			});
			if (!input.name) {
				input.name = findOption.name;
			}
			const option = await this.optionModel.findByIdAndUpdate(id, input, {
				new: true,
			});
			if (!option) throw new NotFoundException('Product not found');
			return option;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async deleteOne({ id }: any): Promise<SuccessResponse<Option>> {
		try {
			if (!isValidObjectId(id)) throw new BadRequestException('ID invalid!');

			await this.optionModel.findOneAndRemove({
				_id: id,
			});

			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async deleteMany(): Promise<SuccessResponse<Option>> {
		try {
			await this.optionModel.deleteMany();
			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
