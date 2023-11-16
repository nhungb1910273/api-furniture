import {
	BadRequestException,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Query,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiNotFoundResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { SuccessResponse } from 'src/shared/response/success-response';
import { Public } from '../auth/decorators/public.decorator';
import { SkuValuesService } from './sku-values.service';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { ListOptions } from 'src/shared/response/common-response';
import { SkuValue } from './schemas/sku-values.schemas';

@ApiTags('sku-values')
@Controller('sku-values')
export class SkuValuesController {
	constructor(private readonly skuValueService: SkuValuesService) {}

	@Public()
	@Get(':id')
	@ApiParam({ name: 'id', type: String, description: 'Product sku ID' })
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'Option not found!',
	})
	findById(@Param('id') id) {
		return this.skuValueService.findOne({
			_id: id,
		});
	}

	@Public()
	@Get('/option-null/:id')
	@ApiParam({ name: 'id', type: String, description: 'Option Null ID' })
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'Option Null not found!',
	})
	findOptionNull(@Param('id') id) {
		return this.skuValueService.findOneOptionNull({
			_id: id,
		});
	}

	@Public()
	@Get()
	@ApiDocsPagination('SkuValue')
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	findAll(@Query() filter: ListOptions<SkuValue>) {
		return this.skuValueService.findAll(filter);
	}

	@Public()
	@Delete()
	@ApiOperation({
		summary: 'Delete a Product Sku',
	})
	@ApiResponse({
		schema: {
			example: {
				code: 200,
				message: 'Success',
			} as SuccessResponse<null>,
		},
		status: 200,
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Product not found!',
	})
	deleteMany() {
		return this.skuValueService.deleteMany();
	}
}
