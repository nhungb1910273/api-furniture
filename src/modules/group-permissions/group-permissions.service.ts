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
			// const objectID = new mongoose.Types.ObjectId(filter._id);
			// const groupPermission = await this.groupPermissionModel.aggregate([
			// 	{ $match: { _id: objectID } },
			// 	{
			// 		$lookup: {
			// 			from: 'permissions',
			// 			localField: 'permissions',
			// 			foreignField: '_id',
			// 			as: 'permissionsObjects',
			// 		},
			// 	},
			// 	{ $unwind: '$permissions' },
			// 	{
			// 		$group: {
			// 			_id: '$_id',
			// 			permissions: { $push: '$permissions' },
			// 			permissionsObjects: { $push: '$permissionsObjects' },
			// 		},
			// 	},
			// ]);
			// return groupPermission[0];
			const data = await this.groupPermissionModel
				.findById({
					_id: filter._id,
				})
				.populate({ path: 'permissions', select: '_id' });

			return data;
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Categorys',
			);
		}
	}

	async findAll(
		filter: ListOptions<GroupPermission>,
	): Promise<ListResponse<GroupPermission>> {
		try {
			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.groupPermissionModel
				.find(filter)
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
			return err;
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
}
