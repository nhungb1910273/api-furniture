import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, isValidObjectId } from 'mongoose';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { SuccessResponse } from 'src/shared/response/success-response';
import { PermissionsService } from '../permissions/permissions.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role, RoleDocument } from './schemas/roles.schema';
import { UpdateRoleDto } from './dto/updated-role-dto';
@Injectable()
export class RolesService {
	constructor(
		@InjectModel(Role.name)
		private roleModel: Model<RoleDocument>,
		private permissionService: PermissionsService,
	) {}

	async findOne(filter: Partial<Role>): Promise<Role> {
		const data = await this.roleModel.findOne(filter);
		if (!data) {
			throw new NotFoundException();
		}
		return data;
	}

	async findRoleById(id: string): Promise<Role> {
		try {
			const role = await this.roleModel.findById(id);
			if (role) {
				return role;
			}
			throw new BadRequestException(id);
		} catch (error) {
			throw new BadRequestException('An error occurred while retrieving roles');
		}
	}

	async createRole(input: CreateRoleDto): Promise<Role> {
		try {
			const findRole = await this.roleModel.findOne({
				name: input.name,
			});
			if (!findRole) {
				const permissionIds = [];
				if (input.permissions.length) {
					for (const permissionId of input.permissions) {
						const findPermission = await this.permissionService.findOneById(
							permissionId,
						);
						if (!findPermission) {
							throw new BadRequestException('Permission not found');
						}
						permissionIds.push(findPermission._id);
					}
					input.permissions = permissionIds;
				}
				const createRole = await this.roleModel.create(input);
				return await createRole.save();
			}
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async updateRole(filter: Partial<Role>, input: UpdateRoleDto): Promise<Role> {
		try {
			const permissionIds = [] as string[];
			if (input.permissions && input.permissions.length > 0) {
				for (const val of input.permissions) {
					const findPermission = await this.permissionService.findOneById(val);
					if (findPermission) {
						permissionIds.push(findPermission._id);
					}
				}
				input.permissions = permissionIds;
			}
			return await this.roleModel.findByIdAndUpdate(filter._id, input, {
				new: true,
			});
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async findAllRoleByPermission(permissionId: string): Promise<Role[]> {
		try {
			const objectID = new mongoose.Types.ObjectId(permissionId);
			const category = await this.roleModel.aggregate([
				{ $match: { rolePermissions: objectID } },
				{
					$lookup: {
						from: 'users',
						localField: 'users',
						foreignField: '_id',
						as: 'users',
					},
				},
				{ $unwind: '$user' },
				{
					$lookup: {
						from: 'rolePermissions',
						localField: 'rolePermissions',
						foreignField: '_id',
						as: 'rolePermissions',
					},
				},
				{ $unwind: '$rolePermission' },
			]);
			return category[0];
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Categorys',
			);
		}
	}

	async findManyRoles(filter: ListOptions<Role>): Promise<ListResponse<Role>> {
		try {
			// const where = {};
			// if (condition?.searchField && condition?.searchValue) {
			// 	where[condition.searchField] = `/.*%${condition.searchValue}*./`;
			// }
			// console.log(where);

			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.roleModel
				.find(filter.search ? { filter, name: filter.search } : filter)
				.sort(sortQuery)
				.skip(offset)
				.limit(limit)
				.populate('permissions');
			// if (result?.length) {
			// 	//NOTE: count total user in role
			// 	for (const role of result) {
			// 		const roleUser = await this.roleModel.findOne({
			// 			where: { id: role.id },
			// 			relations: ['users'],
			// 		});
			// 		role.totalUser = roleUser.users.length ? roleUser.users.length : 0;
			// 	}
			// }

			return {
				items: result,
				total: result?.length,
				options: filter,
			};
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
	async deleteOne({ id }: any): Promise<SuccessResponse<Role>> {
		try {
			if (!isValidObjectId(id)) throw new BadRequestException('ID invalid!');

			await this.roleModel.findOneAndRemove({
				_id: id,
			});

			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
