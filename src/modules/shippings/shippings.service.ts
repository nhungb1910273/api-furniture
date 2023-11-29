import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { Shipping, ShippingDocument } from './schemas/shippings.schema';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
@Injectable()
export class ShippingsService {
	constructor(
		@InjectModel(Shipping.name)
		private shippingModel: Model<ShippingDocument>,
	) {}

	async findOne(filter: Partial<Shipping>): Promise<Shipping> {
		return this.shippingModel.findOne(filter).populate('optionValues');
	}

	async findAll(
		filter: ListOptions<Shipping>,
	): Promise<ListResponse<Shipping>> {
		try {
			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;

			const rgx = (pattern) => new RegExp(`.*${pattern}.*`);

			const result = await this.shippingModel
				.find(
					filter.search
						? { ...filter, provinceApply: rgx(filter.search) }
						: filter,
				)
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
				'An error occurred while retrieving Options',
			);
		}
	}
	async create(input: CreateShippingDto): Promise<Shipping> {
		try {
			const shipping = await this.shippingModel.findOne({
				provinceApply: input.provinceApply,
			});
			if (!shipping) {
				return await this.shippingModel.create(input);
			}
			throw new BadRequestException('province has existed!');
		} catch (err) {
			return err;
		}
	}

	async updateOne(input: UpdateShippingDto, id: string): Promise<Shipping> {
		try {
			const findOption = await this.shippingModel.findOne({
				_id: id,
			});
			if (!input.price) {
				input.price = findOption.price;
			}
			if (!input.provinceApply) {
				input.provinceApply = findOption.provinceApply;
			}
			if (!input.status) {
				input.status = findOption.status;
			}
			const optionSku = await this.shippingModel.findByIdAndUpdate(id, input, {
				new: true,
			});
			if (!optionSku) throw new NotFoundException('Product not found');
			return optionSku;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async deleteShipping(id: string): Promise<string> {
		const shipping = await this.shippingModel.findByIdAndDelete(id);
		if (!shipping) {
			throw new NotFoundException('Shipping not found');
		}
		return 'Delete Shipping successful';
	}
}
