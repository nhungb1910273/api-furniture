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
import { BillsService } from './bills.service';
import { Bill } from './schemas/bills.schema';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';

@ApiTags('bills')
@Controller('bills')
export class BillsController {
	constructor(private readonly billService: BillsService) {}

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
		return this.billService.deleteOne(id);
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
}
