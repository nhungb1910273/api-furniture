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
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart } from './schemas/carts.schema';
import { UpdateCartDto } from './dto/update-cart.dto';

@ApiTags('carts')
@Controller('carts')
export class CartsController {
	constructor(private readonly cartService: CartsService) {}

	@Public()
	@Get(':userId')
	@ApiParam({ name: 'userId', type: String, description: 'Cart userId' })
	@ApiOperation({
		summary: 'Get Cart by userId',
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'Cart not found!',
	})
	getCartByUser(@Param('userId') userId) {
		return this.cartService.getOneByID(userId);
	}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many Cart with many fields',
	})
	@ApiDocsPagination('Cart')
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Cart not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	getAllCarts(@Query() filter: ListOptions<Cart>) {
		return this.cartService.findAll(filter);
	}

	@Public()
	@Post()
	@ApiOperation({
		summary: 'Create a new Cart',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	createCart(@Body() input: CreateCartDto) {
		return this.cartService.create(input);
	}

	@Public()
	@Patch('add-cart-items/:userId')
	@ApiOperation({
		summary: 'Update a Cart',
	})
	@ApiParam({ name: 'userId', type: String, description: 'user ID' })
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	updateCart(@Param('userId') userId, @Body() updateCartDto: UpdateCartDto) {
		console.log(updateCartDto);
		return this.cartService.addCartItem(updateCartDto, userId);
	}

	@Public()
	@Delete(':id')
	@ApiOperation({
		summary: 'Delete a Cart',
	})
	@ApiParam({ name: 'id', type: String, description: 'Cart ID' })
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
		description: 'Cart not found!',
	})
	deleteCart(@Param() id: string) {
		return this.cartService.deleteOne(id);
	}

	@Public()
	@Delete()
	@ApiOperation({
		summary: 'Delete a Cart',
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
		return this.cartService.deleteMany();
	}
}
