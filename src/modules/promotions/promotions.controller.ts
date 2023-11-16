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
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PromotionsService } from './promotions.service';
import { Promotion } from './schemas/promotions.schema';

@ApiTags('promotions')
// @ApiBearerAuth()
@Controller('promotions')
export class PromotionsController {
	constructor(private readonly promotionService: PromotionsService) {}

	@Public()
	@Get(':id')
	@ApiOperation({
		summary: 'Get Promotion by id',
	})
	@ApiParam({ name: 'id', type: String, description: 'Promotion ID' })
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Promotion not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid',
	})
	getPromotionById(@Param('id') id) {
		return this.promotionService.findOne({ _id: id });
	}
	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many Promotion with many fields',
	})
	@ApiDocsPagination('Promotion')
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Promotion not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	getAllPromotions(@Query() filter: ListOptions<Promotion>) {
		return this.promotionService.findAll(filter);
	}

	@Public()
	@Post()
	@ApiOperation({
		summary: 'Create a new Promotion',
	})
	@ApiParam({ name: 'id', type: String, description: 'Promotion ID' })
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	createPromotion(@Body() input: CreatePromotionDto) {
		return this.promotionService.create(input);
	}

	@Public()
	@Patch(':id')
	@ApiParam({ name: 'id', type: String, description: 'Promotion ID' })
	@ApiOperation({
		summary: 'Update a Promotion',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	updatePromotion(@Body() input: UpdatePromotionDto, @Param('id') id) {
		console.log(input);
		return this.promotionService.updateOne(input, id);
	}

	@Public()
	@Delete(':id')
	@ApiOperation({
		summary: 'Delete a Promotion',
	})
	@ApiParam({ name: 'id', type: String, description: 'Promotion ID' })
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
		description: 'Promotion not found!',
	})
	deletePromotion(@Param() id: string) {
		return this.promotionService.deleteOne(id);
	}
}
