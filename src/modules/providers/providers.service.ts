import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import { SuccessResponse } from 'src/shared/response/success-response';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { Provider, ProviderDocument } from './schemas/providers.schema';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
@Injectable()
export class ProvidersService {
	constructor(
		@InjectModel(Provider.name)
		private providerModel: Model<ProviderDocument>,
	) {}

	// async findOne(filter: Partial<Provider>): Promise<Provider> {
	// 	return this.providerModel.findOne(filter);
	// }
	async findOneById(filter: Partial<Provider>): Promise<Provider> {
		console.log(filter);
		return this.providerModel.findOne(filter);
	}
	async findAll(
		filter: ListOptions<Provider>,
	): Promise<ListResponse<Provider>> {
		try {
			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.providerModel
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
				'An error occurred while retrieving room furnitures',
			);
		}
	}
	async create(input: CreateProviderDto): Promise<Provider> {
		try {
			const provider = await this.providerModel.findOne({
				email: input.email,
			});
			if (!provider) {
				return await this.providerModel.create(input);
			}
			throw new BadRequestException('Room furniture has existed!');
		} catch (err) {
			return err;
		}
	}

	// async createOne(input: CreateProviderDto): Promise<Provider> {
	// 	try {
	// 		const user = await this.providerModel.findOne({
	// 			name: input.name,
	// 			description: input.description,
	// 		});
	// 		if (!user) {
	// 			return this.providerModel.create(input);
	// 		}
	// 		throw new BadRequestException('Email has existed!');
	// 	} catch (err) {
	// 		return err;
	// 	}
	// }

	async updateOne(
		input: UpdateProviderDto,
		filter: Partial<Provider>,
	): Promise<Provider> {
		try {
			const findProvider = await this.findOneById({
				_id: filter._id,
			});
			if (input.name) {
				input.name = findProvider.name;
			}

			if (input.email) {
				input.email = findProvider.email;
			}
			if (input.phoneNumber) {
				input.phoneNumber = findProvider.phoneNumber;
			}
			if (input.status) {
				input.status = findProvider.status;
			}
			if (
				input.name ||
				input.address ||
				input.phoneNumber ||
				input.email ||
				input.status
			) {
				return await this.providerModel.findByIdAndUpdate(filter._id, input, {
					new: true,
				});
			}
			throw new BadRequestException('Data invalid!');
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async deleteOne({ id }: any): Promise<SuccessResponse<Provider>> {
		try {
			if (!isValidObjectId(id)) throw new BadRequestException('ID invalid!');

			await this.providerModel.findOneAndRemove({
				_id: id,
			});

			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
