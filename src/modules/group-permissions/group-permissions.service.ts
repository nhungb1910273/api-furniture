import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import {
	GroupPermission,
	GroupPermissionDocument,
} from '../group-permissions/schemas/group-permissions.schema';
import { CreateGroupPermissionDto } from './dto/create-group-permission.dto';
import { UpdateGroupPermissionDto } from './dto/update-group-permission.dto';

@Injectable()
export class GroupPermissionsService {
	constructor(
		@InjectModel(GroupPermission.name)
		private groupPermissionModel: Model<GroupPermissionDocument>,
	) {}

	async findOne(filter: Partial<GroupPermission>): Promise<GroupPermission> {
		return this.groupPermissionModel.findOne(filter);
	}

	async findOneById(
		filter: ListOptions<GroupPermission>,
	): Promise<GroupPermission> {
		try {
			const data = await this.groupPermissionModel
				.findById({
					_id: filter._id,
				})
				.populate({ path: 'permissions', select: '_id' });

			return data;
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Group Permission',
			);
		}
	}

	async findAll(
		filter: ListOptions<GroupPermission>,
	): Promise<ListResponse<GroupPermission>> {
		try {
			const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.groupPermissionModel
				.find(filter.search ? { ...filter, name: rgx(filter.search) } : filter)
				.sort(sortQuery)
				.skip(offset)
				.limit(limit)
				.populate('permissions');
			return {
				items: result,
				total: result?.length,
				options: filter,
			};
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Colors',
			);
		}
	}

	async create(input: CreateGroupPermissionDto): Promise<GroupPermission> {
		try {
			const groupPermission = await this.groupPermissionModel.findOne({
				name: input.name,
			});
			if (!groupPermission) {
				return await this.groupPermissionModel.create(input);
			}
			throw new BadRequestException('Group Permission has existed!');
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	// async getAllGroupPermission() {
	// 	try {
	// 		return await this.groupPermissionModel.find().pretty();
	// 	} catch (error) {
	// 		throw new BadRequestException(
	// 			'An error occurred while retrieving group permissions',
	// 		);
	// 	}
	// }

	async updateOne(
		input: UpdateGroupPermissionDto,
		id: string,
	): Promise<GroupPermission> {
		try {
			return await this.groupPermissionModel.findByIdAndUpdate(id, input, {
				new: true,
				runValidators: true,
			});
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
