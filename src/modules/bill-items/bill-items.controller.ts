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
	ApiBody,
	ApiNotFoundResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { ListOptions } from 'src/shared/response/common-response';
import { SuccessResponse } from 'src/shared/response/success-response';
import { Public } from '../auth/decorators/public.decorator';
import { BillItemsService } from './bill-items.service';
import { BillItem } from './schemas/bill-items.schema';
import { CreateBillItemDto } from './dto/create-bill-item.dto';

@ApiTags('bill-items')
@Controller('bill-items')
export class BillItemsController {
	constructor(private readonly billItemService: BillItemsService) {}
	@Public()
	@Get(':id')
	@ApiParam({ name: 'id', type: String, description: 'bill item ID' })
	@ApiOperation({
		summary: 'Get bill item by ID',
	})
	// @ApiOkResponse({
	// 	status: 200,
	// 	schema: {
	// 		example: {
	// 			_id: '_id',
	// 			name: 'string',
	// 			description: 'string',
	// 			permissions: [],
	// 			createdAt: new Date(),
	// 			updatedAt: new Date(),
	// 		} as BillItem,
	// 	},
	// })
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'bill item not found!',
	})
	getBillItemById(@Param('id') id) {
		return this.billItemService.findOneById({ _id: id });
	}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many bill item with many fields',
	})
	@ApiDocsPagination('bill item')
	// @ApiOkResponse({
	// 	status: 200,
	// 	schema: {
	// 		example: {
	// 			items: [
	// 				{
	// 					_id: '_id',
	// 					name: 'string',
	// 					description: 'string',
	// 					createdAt: new Date(),
	// 					updatedAt: new Date(),
	// 				},
	// 			] as BillItem[],
	// 			total: 0,
	// 			options: {
	// 				limit: 10,
	// 				offset: 0,
	// 				searchField: 'string',
	// 				searchValue: 'string',
	// 				sortBy: 'name',
	// 				sortOrder: ESortOrder.ASC,
	// 			} as ListOptions<BillItem>,
	// 		} as ListResponse<BillItem>,
	// 	},
	// })
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'bill item not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	getAllBillItems(@Query() filter: ListOptions<BillItem>) {
		return this.billItemService.findAll(filter);
	}

	@Public()
	@Post()
	@ApiOperation({
		summary: 'Create a new bill item',
	})
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				productSku: {
					type: 'string',
				},
				quantity: {
					type: 'number',
				},
				name: {
					type: 'string',
				},
			},
		},
	})
	// @ApiCreatedResponse({
	// 	schema: {
	// 		example: {
	// 			code: 200,
	// 			message: 'Success',
	// 			data: {
	// 				_id: '1233456',
	// 				name: 'City gym',
	// 				description: 'Nhiều dụng cụ tập luyện',
	// 				createdAt: new Date(),
	// 				updatedAt: new Date(),
	// 			} as BillItem,
	// 		},
	// 	},
	// })
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	createBillItem(@Body() input: CreateBillItemDto) {
		return this.billItemService.create(input);
	}

	@Public()
	@Delete()
	@ApiOperation({
		summary: 'Delete a bill item',
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
		description: 'bill item not found!',
	})
	deleteMany() {
		return this.billItemService.deleteMany();
	}
}
