import {
	BadRequestException,
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { Public } from '../auth/decorators/public.decorator';
import { CreateGroupPermissionDto } from './dto/create-group-permission.dto';
import { UpdateGroupPermissionDto } from './dto/update-group-permission.dto';
import { GroupPermissionsService } from './group-permissions.service';
import { GroupPermission } from './schemas/group-permissions.schema';

@ApiTags('group-permissions')
@Controller('group-permissions')
export class GroupPermissionsController {
	constructor(
		private readonly groupPermissionService: GroupPermissionsService,
	) {}
	@Public()
	@Get(':id')
	@ApiParam({ name: 'id', type: String, description: 'group permission ID' })
	@ApiOperation({
		summary: 'Get group permission by ID',
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				_id: '_id',
				name: 'string',
				description: 'string',
				permissions: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			} as GroupPermission,
		},
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'group permission not found!',
	})
	getGroupPermissionById(@Param('id') id) {
		return this.groupPermissionService.findOneById({ _id: id });
	}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many group permission with many fields',
	})
	@ApiDocsPagination('group permission')
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '_id',
						name: 'string',
						description: 'string',
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as GroupPermission[],
				total: 0,
				options: {
					limit: 10,
					offset: 0,
					searchField: 'string',
					searchValue: 'string',
					sortBy: 'name',
					sortOrder: ESortOrder.ASC,
				} as ListOptions<GroupPermission>,
			} as ListResponse<GroupPermission>,
		},
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'group permission not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	getAllGroupPermissions(@Query() filter: ListOptions<GroupPermission>) {
		return this.groupPermissionService.findAll(filter);
	}

	@Public()
	@Post()
	@ApiOperation({
		summary: 'Create a new group permission',
	})
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				name: {
					type: 'string',
				},
				description: {
					type: 'string',
				},
			},
		},
	})
	@ApiCreatedResponse({
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					_id: '1233456',
					name: 'City gym',
					description: 'Nhiều dụng cụ tập luyện',
					createdAt: new Date(),
					updatedAt: new Date(),
				} as GroupPermission,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	createGroupPermission(@Body() input: CreateGroupPermissionDto) {
		return this.groupPermissionService.create(input);
	}

	@Public()
	@Patch(':id')
	@ApiParam({ name: 'id', type: String, description: 'group permission ID' })
	@ApiOperation({
		summary: 'Get group permission by ID',
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				_id: '_id',
				name: 'string',
				description: 'string',
				permissions: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			} as GroupPermission,
		},
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'group permission not found!',
	})
	updateGroupPermission(
		@Param('id') id,
		@Body() input: UpdateGroupPermissionDto,
	) {
		return this.groupPermissionService.updateOne(input, id);
	}
}
