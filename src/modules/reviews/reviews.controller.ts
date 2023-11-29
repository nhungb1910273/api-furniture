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
import { Public } from '../auth/decorators/public.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';
import { Review } from './schemas/reviews.shemas';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
	constructor(private readonly reviewService: ReviewsService) {}

	@Public()
	@Get('average-rating')
	async getAverageRating(filter: ListOptions<Review>): Promise<number> {
		const averageRating = await this.reviewService.calculateAverageRating(
			filter,
		);
		return averageRating;
	}

	@Public()
	@Post()
	@ApiConsumes('multipart/form-data')
	@ApiOperation({
		summary: 'Create a new review',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@UseInterceptors(FileFieldsInterceptor([{ name: 'photos', maxCount: 5 }]))
	async createReview(
		@Body() reviewDto: CreateReviewDto,
		// @Req() req: any,
		@UploadedFiles()
		files?: {
			photos?: Express.Multer.File[];
		},
	) {
		if (files) {
			return await this.reviewService.create(reviewDto, files);
		}
	}

	@Public()
	@Patch(':reviewID')
	@ApiConsumes('multipart/form-data')
	@ApiOperation({
		summary: 'Create a new review',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@UseInterceptors(
		FileFieldsInterceptor([{ name: 'photoUpdates', maxCount: 5 }]),
	)
	async updateReview(
		@Param('reviewID') reviewID: string,
		@Body() reviewDto: UpdateReviewDto,
		// @Req() req: any,
		@UploadedFiles()
		files?: { photoUpdates?: Express.Multer.File[] },
	) {
		if (files) {
			return await this.reviewService.updateOne(reviewID, reviewDto, files);
		}
	}

	@Public()
	@Patch('update-status/:id')
	@ApiOperation({
		summary: 'Update a Blog',
	})
	@ApiParam({ name: 'id', type: String, description: 'Review ID' })
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	updateStatus(@Param('id') id, @Body() input: UpdateReviewDto) {
		return this.reviewService.updateStatus(input, id);
	}

	@Public()
	@Delete(':reviewID')
	@ApiOperation({
		summary: '(NOTE: API NÀY TẠM THỜI KHÔNG DÙNG) Delete Review by id',
	})
	@ApiParam({ name: 'reviewID', type: String, description: 'Review ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: null,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Review not found!',
	})
	deleteReviewById(@Param('reviewID') reviewID: string) {
		return this.reviewService.delete(reviewID);
	}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many review',
	})
	@ApiDocsPagination('ReviewSchema')
	findMany(@Query() filter: ListOptions<Review>) {
		return this.reviewService.findAll(filter);
	}

	@Public()
	@Get(':reviewID')
	@ApiOperation({
		summary: 'Get many review',
	})
	@ApiParam({ name: 'reviewID', type: String, description: 'Review ID' })
	findOneByID(@Param('reviewID') reviewID) {
		return this.reviewService.findOne({
			_id: reviewID,
		});
	}
}
