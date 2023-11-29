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
import { Public } from '../auth/decorators/public.decorator';
import { CreateWarehouseReceiptDto } from './dto/create-warehouse-receipts.dto';
import { UpdateWarehouseReceiptDto } from './dto/update-warehouse-receipts.dto';
import { WarehouseReceipt } from './schemas/warehouse-receipts.schema';
import { WarehouseReceiptsService } from './warehouse-receipts.service';
import { SuccessResponse } from 'src/shared/response/success-response';

@ApiTags('warehouse-receipts')
@Controller('warehouse-receipts')
export class WarehouseReceiptsController {
	constructor(
		private readonly warehouseReceiptService: WarehouseReceiptsService,
	) {}

	@Public()
	@Get(':id')
	@ApiParam({ name: 'id', type: String, description: 'Warehouse receipt ID' })
	@ApiOperation({
		summary: 'Get Warehouse receipt by ID',
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'Warehouse receipt not found!',
	})
	getWarehouseReceiptById(@Param('id') id) {
		return this.warehouseReceiptService.findOne({ _id: id });
	}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many Warehouse receipt with many fields',
	})
	@ApiDocsPagination('WarehouseReceipt')
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Warehouse receipt not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	getAllWarehouseReceipts(@Query() filter: ListOptions<WarehouseReceipt>) {
		return this.warehouseReceiptService.findAll(filter);
	}

	@Public()
	@Post()
	@ApiOperation({
		summary: 'Create a new Warehouse Receipt',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	createWarehouseReceipt(@Body() input: CreateWarehouseReceiptDto) {
		return this.warehouseReceiptService.createOne(input);
	}

	@Public()
	@Patch('add-WR-detail')
	@ApiOperation({
		summary: 'Update a WR detail',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	addWRD(@Body() input: UpdateWarehouseReceiptDto) {
		return this.warehouseReceiptService.addWRD(input);
	}

	@Public()
	@Patch('review/:id')
	@ApiParam({ name: 'id', type: String, description: 'Bill ID' })
	@ApiOperation({
		summary: 'Update a Bill',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	updateRequestCancel(
		@Param('id') id,
		@Body() input: UpdateWarehouseReceiptDto,
	) {
		console.log(input);
		return this.warehouseReceiptService.updateStatus(input, id);
	}
	@Public()
	@Delete(':id')
	@ApiOperation({
		summary: 'Delete a category',
	})
	@ApiParam({ name: 'id', type: String, description: 'category ID' })
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
		description: 'category not found!',
	})
	deleteWR(@Param() id: string) {
		return this.warehouseReceiptService.deleteOne(id);
	}

	@Public()
	@Delete()
	@ApiOperation({
		summary: 'Delete a Blog',
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
		return this.warehouseReceiptService.deleteMany();
	}
}
