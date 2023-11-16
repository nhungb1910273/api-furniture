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
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { Public } from '../auth/decorators/public.decorator';
import { CreateProviderDto } from './dto/create-provider.dto';
import { ProvidersService } from './providers.service';
import { Provider } from './schemas/providers.schema';
import { UpdateProviderDto } from './dto/update-provider.dto';

@ApiTags('providers')
// @ApiBearerAuth()
@Controller('providers')
export class ProvidersController {
	constructor(private readonly providerService: ProvidersService) {}

	@Public()
	@Get(':id')
	@ApiOperation({
		summary: 'Get Provider by id',
	})
	@ApiParam({ name: 'id', type: String, description: 'Provider ID' })
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				_id: '12345',
				createdAt: '2023-06-29T07:35:43.345Z',
				updatedAt: '2023-06-29T07:36:49.766Z',
				name: 'Provider 1',
				address: 'Viet Nam',
				email: 'Provider1@gmail.com',
			} as unknown as Provider,
		},
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Provider not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid',
	})
	getProviderById(@Param('id') id) {
		return this.providerService.findOneById({ _id: id });
	}
	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many Provider with many fields',
	})
	@ApiDocsPagination('Provider')
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '_id',
						name: 'string',
						address: {},
						email: 'string',
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as Provider[],
				total: 0,
				options: {
					limit: 10,
					offset: 0,
					searchField: 'string',
					searchValue: 'string',
					sortBy: 'name',
					sortOrder: ESortOrder.ASC,
				} as ListOptions<Provider>,
			} as ListResponse<Provider>,
		},
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Provider not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	getAllProviders(@Query() filter: ListOptions<Provider>) {
		return this.providerService.findAll(filter);
	}

	@Public()
	@Post()
	@ApiOperation({
		summary: 'Create a new Provider',
	})
	@ApiParam({ name: 'id', type: String, description: 'Provider ID' })
	@ApiBody({
		type: CreateProviderDto,
		examples: {
			example: {
				value: {
					name: 'Admin Provider',
					address: {},
					email: 'nhung@gmail.com',
				} as CreateProviderDto,
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
					name: 'Admin Provider',
					address: {},
					email: 'nhung@gmail.com',
					createdAt: new Date(),
					updatedAt: new Date(),
				} as Provider,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	createProvider(@Body() input: CreateProviderDto) {
		return this.providerService.create(input);
	}

	@Public()
	@Patch(':id')
	@ApiOperation({
		summary: 'Update a Provider',
	})
	@ApiOkResponse({
		// type: Provider,
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					name: 'Provider',
					place: 'Viet Nam',
					email: 'Provider@test.com',
				},
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	updateProvider(@Body() input: UpdateProviderDto, @Param('id') id) {
		return this.providerService.updateOne(input, id);
	}

	// @Public()
	// @Delete(':id')
	// @ApiOperation({
	// 	summary: 'Delete a Provider',
	// })
	// @ApiParam({ name: 'id', type: String, description: 'Provider ID' })
	// @ApiResponse({
	// 	schema: {
	// 		example: {
	// 			code: 200,
	// 			message: 'Success',
	// 		} as SuccessResponse<null>,
	// 	},
	// 	status: 200,
	// })
	// @ApiBadRequestResponse({
	// 	type: BadRequestException,
	// 	status: 400,
	// 	description: '[Input] invalid!',
	// })
	// @ApiNotFoundResponse({
	// 	type: NotFoundException,
	// 	status: 404,
	// 	description: 'Provider not found!',
	// })
	// deleteProvider(@Param() id: string) {
	// 	return this.providerService.deleteOne(id);
	// }
}
