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
import { DefaultListDto } from 'src/shared/dto/default-list-dto';
import { ListOptions } from 'src/shared/response/common-response';
import { SuccessResponse } from 'src/shared/response/success-response';
import { Public } from '../auth/decorators/public.decorator';
import { CreateProductSkuDto } from './dto/create-product-sku.dto';
import { UpdateProductSkuDto } from './dto/update-product-sku.dto';
import { ProductSkusService } from './product-skus.service';
import { ProductSku } from './schemas/product-skus.schemas';
import { CreateReviewDto } from '../reviews/dto/create-review.dto';

@ApiTags('product-skus')
@Controller('product-skus')
export class ProductSkusController {
	constructor(private readonly productSkuService: ProductSkusService) {}

	@Public()
	@Get(':id')
	@ApiParam({ name: 'id', type: String, description: 'Product sku ID' })
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'Option not found!',
	})
	findById(@Param('id') id) {
		return this.productSkuService.findOne({
			_id: id,
		});
	}

	@Public()
	@Get('numberSKU/:numberSKU')
	@ApiParam({
		name: 'numberSKU',
		type: String,
		description: 'Product sku numberSKU',
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'Option not found!',
	})
	findByNumberSku(@Param('numberSKU') numberSKU) {
		return this.productSkuService.findOneByNumberSku({
			numberSKU: numberSKU,
		});
	}

	@Public()
	@Get()
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	findAll(@Query() filter: DefaultListDto) {
		return this.productSkuService.findAll(filter);
	}

	@Public()
	@Get('/all/:idProduct')
	@ApiParam({
		name: 'idProduct',
		type: String,
		description: 'Product ID',
		example: '65461c2501149ef21ea3e389',
	})
	@ApiOperation({
		summary: 'Get many Product sku by Product',
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Product sku not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	getAllByProduct(
		@Query() filter: ListOptions<ProductSku>,
		@Param('idProduct') idProduct,
	) {
		console.log('INPUT', idProduct);
		return this.productSkuService.findAllByProduct(filter, idProduct);
	}

	@Public()
	@Post()
	@ApiOperation({
		summary: 'Create a product detail',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@UseInterceptors(FileFieldsInterceptor([{ name: 'photos', maxCount: 5 }]))
	@ApiConsumes('multipart/form-data')
	create(
		@Body() input: CreateProductSkuDto,
		@UploadedFiles()
		files?: { photos?: Express.Multer.File[] },
	) {
		console.log('ProductSKU', files);
		if (files && files.photos) {
			return this.productSkuService.create(input, files);
		}
	}

	@Public()
	@Patch(':id')
	@ApiParam({ name: 'id', type: String, description: 'Product sku ID' })
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@UseInterceptors(
		FileFieldsInterceptor([{ name: 'photoUpdates', maxCount: 10 }]),
	)
	@ApiConsumes('multipart/form-data')
	update(
		@Param('id') id,
		@Body() input: UpdateProductSkuDto,
		@UploadedFiles()
		files?: { photoUpdates?: Express.Multer.File[] },
	) {
		console.log('Update', input);
		return this.productSkuService.updateOne(input, id, files);
	}

	@Public()
	@Delete(':id')
	@ApiParam({ name: 'id', type: String, description: 'Product sku ID' })
	remove(@Param('id') id) {
		return this.productSkuService.deleteOne(id);
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
		return this.productSkuService.deleteMany();
	}

	@Patch(':productSkuId/reviews/add')
	@ApiOperation({
		summary: 'Add the newest reviews to the productSku',
	})
	@ApiConsumes('multipart/form-data')
	@ApiParam({
		name: 'productSkuId',
		type: String,
		description: 'productSku ID',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@UseInterceptors(FileFieldsInterceptor([{ name: 'photos', maxCount: 5 }]))
	async addReviewFacility(
		@Param('productSkuId') productSkuId,
		@Body() reviewDto: CreateReviewDto,
		@UploadedFiles()
		files?: {
			photos?: Express.Multer.File[];
		},
	) {
		return await this.productSkuService.addReview(
			productSkuId,
			reviewDto,
			files,
		);
	}
}
