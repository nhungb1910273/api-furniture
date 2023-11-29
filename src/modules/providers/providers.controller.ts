import {
	BadRequestException,
	Body,
	Controller,
	Delete,
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
import { ListOptions } from 'src/shared/response/common-response';
import { Public } from '../auth/decorators/public.decorator';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ProvidersService } from './providers.service';
import { Provider } from './schemas/providers.schema';

@ApiTags('providers')
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
		return this.providerService.findOne({
			_id: id,
		});
	}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many Provider with many fields',
	})
	@ApiDocsPagination('Provider')
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

	@Public()
	@Delete()
	@ApiOperation({
		summary: 'Delete many Provider with many fields',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	deleteMany() {
		return this.providerService.deleteMany();
	}
}
