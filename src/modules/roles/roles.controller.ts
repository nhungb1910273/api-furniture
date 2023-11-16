import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Post,
	Query,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { DefaultListDto } from 'src/shared/dto/default-list-dto';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import { SuccessResponse } from 'src/shared/response/success-response';
import { Public } from '../auth/decorators/public.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';
import { Role } from './schemas/roles.schema';
import { ListOptions } from 'src/shared/response/common-response';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}
	@Public()
	@Get(':id')
	@ApiParam({ name: 'id', type: String, description: 'User ID' })
	@ApiOkResponse({ type: Role, status: 200 })
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'Role not found!',
	})
	findById(@Param('id') id) {
		return this.rolesService.findRoleById(id);
	}
	@Public()
	@Get()
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	findAll(@Query() filter: ListOptions<Role>) {
		return this.rolesService.findManyRoles(filter);
	}

	@Public()
	@Post()
	create(@Body() createRoleDto: CreateRoleDto) {
		return this.rolesService.createRole(createRoleDto);
	}
	// @Public()
	// @Patch(':id')
	// update(@Param('id') id, @Body() updateRoleDto: Partial<CreateRoleDto>) {
	// 	return this.rolesService.updateRole(id, updateRoleDto);
	// }
	@Public()
	@Delete(':id')
	remove(@Param('id') id) {
		return this.rolesService.deleteOne(id);
	}
}
