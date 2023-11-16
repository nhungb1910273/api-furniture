import {
	BadRequestException,
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	Post,
	Query,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiNotFoundResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionsService } from './permissions.service';
import { Permission } from './schemas/permissions.schema';
// import { DefaultListDto } from 'src/shared/dto/default-list-dto';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { ListOptions } from 'src/shared/response/common-response';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
	constructor(private readonly permissionsService: PermissionsService) {}

	@Public()
	@Get(':id')
	@ApiParam({ name: 'id', type: String, description: 'Permission ID' })
	@ApiOperation({
		summary: 'Get Permission by ID',
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'Permission not found!',
	})
	getPermissionById(@Param('id') id) {
		return this.permissionsService.findOneById(id);
	}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many permissions',
	})
	@ApiDocsPagination('Permission')
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Permission not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid',
	})
	getPermissions(@Query() filter: ListOptions<Permission>) {
		return this.permissionsService.findAll(filter);
	}

	@Public()
	@Post()
	@ApiOperation({
		summary: 'Create a new permission',
	})
	// @ApiCreatedResponse({
	// 	schema: {
	// 		example: {
	// 			code: 200,
	// 			message: 'Success',
	// 			data: {
	// 				_id: '1233456',
	// 				groupPermissionId: 'string',
	// 				name: 'City gym',
	// 				description: 'Nhiều dụng cụ tập luyện',
	// 				createdAt: new Date(),
	// 				updatedAt: new Date(),
	// 			} as Permission,
	// 		},
	// 	},
	// })
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	createPermission(@Body() input: CreatePermissionDto) {
		return this.permissionsService.create(input);
	}
}
