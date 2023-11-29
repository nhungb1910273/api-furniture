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
	ApiNotFoundResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { ListOptions } from 'src/shared/response/common-response';
import { SuccessResponse } from 'src/shared/response/success-response';
import { Public } from '../auth/decorators/public.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { Product } from './schemas/products.schema';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';

@ApiTags('products')
@Controller('products')
export class ProductsController {
	constructor(private readonly productService: ProductsService) {}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many Product with many fields',
	})
	@ApiDocsPagination('Product')
	@ApiQuery({
		name: 'room',
		type: String,
		required: false,
		example: '652abb7f6968b26f5db63545',
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Product not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	getAllProducts(@Query() filter: ListOptions<Product>) {
		return this.productService.findAllProduct(filter);
	}

	@Public()
	@Get("sold-out")
	@ApiOperation({
		summary: 'Get many Product with many fields',
	})
	@ApiDocsPagination('Product')
	@ApiQuery({
		name: 'room',
		type: String,
		required: false,
		example: '652abb7f6968b26f5db63545',
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Product not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	getProductsHaveFilterQuantity(@Query() filter: ListOptions<Product>) {
		return this.productService.getProductsHaveFilterQuantity(filter)
	}

	// @Public()
	// @Get()
	// @ApiOperation({
	// 	summary: 'Get many Product with many fields',
	// })
	// @ApiNotFoundResponse({
	// 	type: NotFoundException,
	// 	status: 404,
	// 	description: 'Product not found!',
	// })
	// @ApiBadRequestResponse({
	// 	type: BadRequestException,
	// 	status: 400,
	// 	description: '[Input] invalid!',
	// })
	// findAll(@Query() filter: ListOptions<Product>) {
	// 	return this.productService.findAll(filter);
	// }

	@Public()
	@Get(':id')
	@ApiParam({ name: 'id', type: String, description: 'product ID' })
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	findOne(@Param('id') id) {
		return this.productService.findOneProduct(id);
	}

	// @Public()
	// @Get()
	// @ApiOperation({
	// 	summary: 'Get many Product with many fields',
	// })
	// @ApiDocsPagination('Product')
	// @ApiNotFoundResponse({
	// 	type: NotFoundException,
	// 	status: 404,
	// 	description: 'Product not found!',
	// })
	// @ApiBadRequestResponse({
	// 	type: BadRequestException,
	// 	status: 400,
	// 	description: '[Input] invalid!',
	// })
	// getAllProductsWithFields(@Query() filter: GetProductDto) {
	// 	console.log('INPUT', filter);
	// 	return this.productService.findAllByFields(filter);
	// }

	@Public()
	@Post()
	@ApiOperation({
		summary: 'Create a new product',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@ApiBody({
		type: CreateProductDto,
		examples: {
			example: {
				value: {
					roomFurniture: 'string',
					category: 'string',
					name: 'string',
					description: 'string',
					content: 'string',
					view: 0,
					installationCost: 20,
					isArrival: true,
					isHidden: false,
				} as CreateProductDto,
			},
		},
	})
	createProduct(@Body() input: CreateProductDto) {
		return this.productService.createProduct(input);
	}

	@Public()
	@Patch(':id')
	@ApiOperation({
		summary: 'Update a product',
	})
	@ApiParam({ name: 'id', type: String, description: 'product ID' })
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	updateProduct(@Param('id') id, @Body() input: UpdateProductDto) {
		console.log(input, id);
		return this.productService.updateProduct(input, id);
	}

	// @Public()
	// @Patch('update-favorite/:id')
	// @ApiOperation({
	// 	summary: 'Update a product',
	// })
	// @ApiParam({ name: 'id', type: String, description: 'product ID' })
	// @ApiBadRequestResponse({
	// 	type: BadRequestException,
	// 	status: 400,
	// 	description: '[Input] invalid!',
	// })
	// updateProductFavorite(@Param('id') id, @Body() input: UpdateProductDto) {
	// 	return this.productService.updateProduct(input, id);
	// }

	@Public()
	@Delete(':id')
	@ApiOperation({
		summary: 'Delete a Product',
	})
	// @ApiParam({ name: 'id', type: String, description: 'Product ID' })
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
	deleteProduct(@Param('id') id) {
		return this.productService.deleteOne(id);
	}

	@Public()
	@Delete()
	@ApiOperation({
		summary: 'Delete a Product',
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
		return this.productService.deleteMany();
	}
}
