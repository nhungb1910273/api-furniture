import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Patch,
	Post,
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
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import {
	ErrorResponse,
	ListOptions,
} from 'src/shared/response/common-response';
import { SuccessResponse } from 'src/shared/response/success-response';
import { Public } from '../auth/decorators/public.decorator';
import { BillsService } from './bills.service';
import { Bill } from './schemas/bills.schema';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';

@ApiTags('bills')
@Controller('bills')
export class BillsController {
	constructor(private readonly billService: BillsService) {}

	@Public()
	@Get(':id')
	@ApiParam({ name: 'id', type: String, description: 'Bill id' })
	@ApiOperation({
		summary: 'Get Bill by id',
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'Bill not found!',
	})
	getBillById(@Param('id') id) {
		return this.billService.findOne({ _id: id });
	}

	@Public()
	@Get(':userId')
	@ApiParam({ name: 'userId', type: String, description: 'Bill userId' })
	@ApiOperation({
		summary: 'Get Bill by userId',
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'Bill not found!',
	})
	getBillByUser(@Param('userId') userId) {
		return this.billService.findOne({ user: userId });
	}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many Bill with many fields',
	})
	@ApiDocsPagination('Bill')
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Bill not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	getAllBills(@Query() filter: ListOptions<Bill>) {
		return this.billService.findAll(filter);
	}

	@Public()
	@Post()
	@ApiOperation({
		summary: 'Create a new Bill',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	createBill(@Body() input: CreateBillDto) {
		console.log('input', input);
		return this.billService.create(input);
	}

	@Public()
	@Patch('add-bill-items')
	@ApiOperation({
		summary: 'Update a Bill',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	updateBill(@Body() updateBillDto: UpdateBillDto) {
		console.log(updateBillDto);
		return this.billService.addBillItem(updateBillDto);
	}

	@Public()
	@Patch('request-cancel/:id')
	@ApiParam({ name: 'id', type: String, description: 'Bill ID' })
	@ApiOperation({
		summary: 'Update a Bill',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	updateRequestCancel(@Param('id') id, @Body() updateBillDto: UpdateBillDto) {
		console.log(updateBillDto);
		return this.billService.updateRequestCancel(id, updateBillDto);
	}

	@Public()
	@Patch(':id')
	@ApiParam({ name: 'id', type: String, description: 'Bill ID' })
	@ApiOperation({
		summary: 'Update a Bill',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	updateStatus(@Param('id') id, @Body() updateBillDto: UpdateBillDto) {
		console.log(updateBillDto);
		return this.billService.updateStatus(id, updateBillDto);
	}

	@Public()
	@Delete(':id')
	@ApiOperation({
		summary: 'Delete a Bill',
	})
	@ApiParam({ name: 'id', type: String, description: 'Bill ID' })
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
		description: 'Bill not found!',
	})
	deleteBill(@Param() id: string) {
		return this.billService.delete(id);
	}

	@Public()
	@Delete()
	@ApiOperation({
		summary: 'Delete a Bill',
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
		return this.billService.deleteMany();
	}

	//BILLS
	@Public()
	@ApiOperation({
		summary: 'Get Quantity Bills Statistic',
		// description: `Get quantity bills statistic of system.\n\nRoles: ${UserRole.ADMIN}.`,
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: {
					numerBills: 1,
				},
			},
		},
	})
	@ApiResponse({
		status: 401,
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: '403',
				message: `Forbidden resource`,
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@Get('statics/quantity')
	async getQuantityBillsStats(): Promise<object> {
		return await this.billService.getQuantityBillsStats();
	}

	// @Public()
	// @ApiOperation({
	// 	summary: 'Get Yearly Bills Statistic',
	// 	// description: `Get yearly bills statistic of system.\n\nRoles: ${UserRole.ADMIN}.`,
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	schema: {
	// 		example: {
	// 			data: [
	// 				{
	// 					numberBills: 7,
	// 					totalPrice: 3940000,
	// 					avgTotalPrice: 562857.1428571428,
	// 					minPrice: 140000,
	// 					maxPrice: 1830000,
	// 					year: 2023,
	// 				},
	// 				{
	// 					numberBills: 1,
	// 					totalPrice: 1680000,
	// 					avgTotalPrice: 1680000,
	// 					minPrice: 1680000,
	// 					maxPrice: 1680000,
	// 					year: 2022,
	// 				},
	// 				{
	// 					numberBills: 1,
	// 					totalPrice: 300000,
	// 					avgTotalPrice: 300000,
	// 					minPrice: 300000,
	// 					maxPrice: 300000,
	// 					year: 2021,
	// 				},
	// 			],
	// 		},
	// 	},
	// })
	// @ApiResponse({
	// 	status: 401,
	// 	schema: {
	// 		example: {
	// 			code: '401',
	// 			message: 'Unauthorized',
	// 			details: null,
	// 		} as ErrorResponse<null>,
	// 	},
	// })
	// @ApiResponse({
	// 	status: 403,
	// 	schema: {
	// 		example: {
	// 			code: '403',
	// 			message: `Forbidden resource`,
	// 			details: null,
	// 		} as ErrorResponse<null>,
	// 	},
	// })
	// @Get('statics/yearly')
	// // @Roles(UserRole.ADMIN)
	// // @UseGuards(RolesGuard)
	// async getYearlyBillStats(): Promise<Array<object>> {
	// 	return await this.billService.getYearlyBillStats();
	// }

	@Public()
	@ApiOperation({
		summary: 'Get Monthly Bills Statistic',
		// description: `Get monthly bills statistic of system.\n\nRoles: ${UserRole.ADMIN}.`,
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: '403',
				message: `Forbidden resource`,
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@Get('statics/monthly/:year')
	// @Roles(UserRole.ADMIN)
	// @UseGuards(RolesGuard)
	async getMonthlyBillStats(
		@Param('year', ParseIntPipe) year: number,
	): Promise<Array<object>> {
		return await this.billService.getMonthlyBillStats(year);
	}

	@Public()
	@ApiOperation({
		summary: 'Get Monthly Bills Statistic',
		// description: `Get monthly bills statistic of system.\n\nRoles: ${UserRole.ADMIN}.`,
	})
	@Get('statics/:week/weekly/:month/monthly/:year')
	// @Roles(UserRole.ADMIN)
	// @UseGuards(RolesGuard)
	async getWeeklyBillStats(
		@Param('month', ParseIntPipe) month: number,
		@Param('year', ParseIntPipe) year: number,
		@Param('week', ParseIntPipe) week: number,
	): Promise<Array<object>> {
		return await this.billService.getWeeklyBillStats(month, year, week);
	}

	@Public()
	@Get('/performance/:year')
	async getSalesPerformance(@Param('year') year: number): Promise<number> {
		return this.billService.getSalesPerformance(year);
	}

	@Public()
	@Get('/performance-percentage/:month/:year')
	async getSalesPerformancePercentage(
		@Param('year') year: number,
		@Param('month') month: number,
	): Promise<number> {
		return this.billService.getSalesPerformancePercentage(month, year);
	}

	@Public()
	@Get('/customer-of-month/:month/:year')
	async getTopCustomerOfTheMonth(
		@Param('year') year: number,
		@Param('month') month: number,
	): Promise<any> {
		return this.billService.getTopCustomerOfMonth(month, year);
	}
}
