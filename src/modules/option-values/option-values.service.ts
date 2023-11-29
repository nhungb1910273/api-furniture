import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { OptionsService } from '../options/options.service';
import { PhotoService } from '../photos/photo.service';
import { CreateOptionValueDto } from './dto/create-option-value.dto';
import { UpdateOptionValueDto } from './dto/update-option-value.dto';
import {
	OptionValue,
	OptionValueDocument,
} from './schemas/option-values.schemas';
import { SuccessResponse } from 'src/shared/response/success-response';
@Injectable()
export class OptionValuesService {
	constructor(
		@InjectModel(OptionValue.name)
		private optionValueModel: Model<OptionValueDocument>,
		private photoService: PhotoService,
		private optionService: OptionsService,
	) {}

	async findOne(filter: Partial<OptionValue>): Promise<OptionValue> {
		return this.optionValueModel.findOne(filter).populate('optionSku');
	}

	async findAll(
		filter: ListOptions<OptionValue>,
	): Promise<ListResponse<OptionValue>> {
		try {
			const rgx = (pattern) => new RegExp(`.*${pattern}.*`);

			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.optionValueModel
				.find(filter.search ? { ...filter, name: rgx(filter.search) } : filter)
				.sort(sortQuery)
				.skip(offset)
				.limit(limit)
				.populate('optionSku');

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
	async create(
		input: CreateOptionValueDto,
		photo?: Express.Multer.File,
	): Promise<OptionValue> {
		try {
			const findOptionValue = await this.optionValueModel.findOne({
				name: input.name,
			});
			if (!findOptionValue) {
				const findOption = await this.optionService.findOne({
					_id: input.optionSku,
				});
				if (findOption) {
					const optionValue = await this.optionValueModel.create({
						name: input.name,
						optionSku: findOption._id,
					});
					if (photo) {
						const createPhoto = await this.photoService.uploadOneFile(
							photo,
							optionValue._id,
						);
						optionValue.photo = createPhoto;
					}
					return await optionValue.save();
				} else {
					throw new BadRequestException('Option has existed!');
				}
			}
			throw new BadRequestException('Option value has existed!');
		} catch (err) {
			return err;
		}
	}

	async updateOne(
		input: UpdateOptionValueDto,
		id: string,
		photo?: Express.Multer.File,
	): Promise<OptionValue> {
		try {
			console.log('Value', input);
			const findOptionValue = await this.optionValueModel.findOne({
				_id: id,
			});
			if (!input.name) {
				input.name = findOptionValue.name;
			}
			if (!input.optionSku) {
				input.optionSku = findOptionValue.optionSku._id;
			}
			const optionValue = await this.optionValueModel.findByIdAndUpdate(
				id,
				input,
				{
					new: true,
				},
			);
			if (photo) {
				await this.photoService.delete(optionValue.photo._id);
				const createPhoto = await this.photoService.uploadOneFile(
					photo,
					optionValue._id,
				);
				optionValue.photo = createPhoto;
				await optionValue.save();
			}
			if (!optionValue) throw new NotFoundException('Option value not found');
			return optionValue;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async deleteOne({ id }: any): Promise<SuccessResponse<OptionValue>> {
		try {
			if (!isValidObjectId(id)) throw new BadRequestException('ID invalid!');

			await this.optionValueModel.findOneAndRemove({
				_id: id,
			});

			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
	async deleteMany(): Promise<SuccessResponse<OptionValue>> {
		try {
			await this.optionValueModel.deleteMany();
			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
