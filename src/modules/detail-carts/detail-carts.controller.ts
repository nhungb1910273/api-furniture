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
import { DetailCartsService } from './detail-carts.service';
import { CreateDetailCartDto } from './dto/create-detail-cart.dto';
import { DetailCart } from './schemas/detail-carts.schema';

@ApiTags('detail-carts')
@Controller('detail-carts')
export class DetailCartsController {
	constructor(private readonly detailCartService: DetailCartsService) {}
	@Public()
	@Get(':id')
	@ApiParam({ name: 'id', type: String, description: 'detail cart ID' })
	@ApiOperation({
		summary: 'Get detail cart by ID',
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
	// 		} as DetailCart,
	// 	},
	// })
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'detail cart not found!',
	})
	getDetailCartById(@Param('id') id) {
		return this.detailCartService.findOneById({ _id: id });
	}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many detail cart with many fields',
	})
	@ApiDocsPagination('detail cart')
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
	// 			] as DetailCart[],
	// 			total: 0,
	// 			options: {
	// 				limit: 10,
	// 				offset: 0,
	// 				searchField: 'string',
	// 				searchValue: 'string',
	// 				sortBy: 'name',
	// 				sortOrder: ESortOrder.ASC,
	// 			} as ListOptions<DetailCart>,
	// 		} as ListResponse<DetailCart>,
	// 	},
	// })
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'detail cart not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	getAllDetailCarts(@Query() filter: ListOptions<DetailCart>) {
		return this.detailCartService.findAll(filter);
	}

	@Public()
	@Post()
	@ApiOperation({
		summary: 'Create a new detail cart',
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
	// 			} as DetailCart,
	// 		},
	// 	},
	// })
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	createDetailCart(@Body() input: CreateDetailCartDto) {
		return this.detailCartService.create(input);
	}

	@Public()
	@Delete(':id')
	@ApiParam({ name: 'id', type: String, description: 'detail cart ID' })
	@ApiOperation({
		summary: 'Remove detail cart by ID',
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'detail cart not found!',
	})
	removeDetailCartById(@Param() id: string) {
		console.log(id);
		return this.detailCartService.deleteOne(id);
	}

	@Public()
	@Delete()
	@ApiOperation({
		summary: 'Delete a Detail cart',
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
		description: 'Detail cart not found!',
	})
	deleteMany() {
		return this.detailCartService.deleteMany();
	}
}
