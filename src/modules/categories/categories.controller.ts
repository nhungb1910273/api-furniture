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
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './schemas/categories.schema';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
	constructor(private readonly categoryService: CategoriesService) {}

	@Public()
	@Get(':id')
	@ApiParam({ name: 'id', type: String, description: 'category ID' })
	@ApiOperation({
		summary: 'Get category by ID',
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'category not found!',
	})
	getCategoryById(@Param('id') id) {
		return this.categoryService.findOne({ _id: id });
	}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many category with many fields',
	})
	@ApiDocsPagination('Category')
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'category not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	getAllCategories(@Query() filter: ListOptions<Category>) {
		return this.categoryService.findAll(filter);
	}

	@Public()
	@Post()
	@ApiOperation({
		summary: 'Create a new category',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@UseInterceptors(FileInterceptor('photo'))
	@ApiConsumes('multipart/form-data')
	createCategory(
		@Body() input: CreateCategoryDto,
		@UploadedFile()
		photo: Express.Multer.File,
	) {
		if (photo) {
			return this.categoryService.createCategory(input, photo);
		}
	}

	@Public()
	@Patch(':id')
	@ApiOperation({
		summary: 'Update a category',
	})
	@ApiParam({ name: 'id', type: String, description: 'category ID' })
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@UseInterceptors(FileInterceptor('photo'))
	@ApiConsumes('multipart/form-data')
	updateCategory(
		@Param('id') id,
		@Body() updateCategoryDto: UpdateCategoryDto,
		@UploadedFile()
		photo?: Express.Multer.File,
	) {
		return this.categoryService.updateOne(updateCategoryDto, id, photo);
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
			} as SuccessResponse<Category>,
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
	deleteCategory(@Param() id: string) {
		console.log('controller', id);
		return this.categoryService.deleteOne(id);
	}
}
