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
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
	ApiBadRequestResponse,
	ApiConsumes,
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
import { WarehouseReceiptsService } from './warehouse-receipts.service';
import { WarehouseReceipt } from './schemas/warehouse-receipts.schema';
import { CreateWarehouseReceiptDto } from './dto/create-warehouse-receipts.dto';

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
		return this.warehouseReceiptService.create(input);
	}

	// @Public()
	// @Patch()
	// @ApiOperation({
	// 	summary: 'Update a category',
	// })
	// @ApiParam({ name: 'id', type: String, description: 'category ID' })
	// @ApiBadRequestResponse({
	// 	type: BadRequestException,
	// 	status: 400,
	// 	description: '[Input] invalid!',
	// })
	// @UseInterceptors(FileFieldsInterceptor([{ name: 'photos', maxCount: 5 }]))
	// updateCategory(
	// 	@Param('id') id,
	// 	@Body() updateCategoryDto: UpdateCategoryDto,
	// 	@UploadedFiles()
	// 	photos?: Express.Multer.File[],
	// ) {
	// 	return this.warehouseReceiptService.updateOne(
	// 		updateCategoryDto,
	// 		id,
	// 		photos,
	// 	);
	// }

	// @Public()
	// @Delete(':id')
	// @ApiOperation({
	// 	summary: 'Delete a category',
	// })
	// @ApiParam({ name: 'id', type: String, description: 'category ID' })
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
	// 	description: 'category not found!',
	// })
	// deleteCategory(@Param() id: string) {
	// 	return this.warehouseReceiptService.deleteOne(id);
	// }
}
