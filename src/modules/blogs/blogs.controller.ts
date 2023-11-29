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
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Blog } from './schemas/blogs.schema';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';

@ApiTags('blogs')
@Controller('blogs')
export class BlogsController {
	constructor(private readonly blogService: BlogsService) {}

	@Public()
	@Get(':id')
	@ApiParam({ name: 'id', type: String, description: 'Blog ID' })
	@ApiOperation({
		summary: 'Get Blog by ID',
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'Blog not found!',
	})
	getBlogById(@Param('id') id) {
		return this.blogService.findOne({ _id: id });
	}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many Blog with many fields',
	})
	@ApiDocsPagination('Blog')
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Blog not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	getAllBlogs(@Query() filter: ListOptions<Blog>) {
		return this.blogService.findAll(filter);
	}

	@Public()
	@Post()
	@ApiOperation({
		summary: 'Create a new Blog',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@UseInterceptors(FileFieldsInterceptor([{ name: 'photos', maxCount: 5 }]))
	@ApiConsumes('multipart/form-data')
	createBlog(
		@Body() input: CreateBlogDto,
		@UploadedFiles()
		files?: { photos?: Express.Multer.File[] },
	) {
		return this.blogService.create(input, files);
	}

	@Public()
	@Patch(':id')
	@ApiOperation({
		summary: 'Update a Blog',
	})
	@ApiParam({ name: 'id', type: String, description: 'Blog ID' })
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@UseInterceptors(
		FileFieldsInterceptor([{ name: 'photoUpdates', maxCount: 5 }]),
	)
	@ApiConsumes('multipart/form-data')
	updateBlog(
		@Param('id') id,
		@Body() updateBlogDto: UpdateBlogDto,
		@UploadedFiles()
		files?: { photoUpdates?: Express.Multer.File[] },
	) {
		return this.blogService.updateOne(updateBlogDto, id, files);
	}

	@Public()
	@Patch('update-status/:id')
	@ApiOperation({
		summary: 'Update a Blog',
	})
	@ApiParam({ name: 'id', type: String, description: 'Blog ID' })
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	updateStatusBlog(@Param('id') id, @Body() updateBlogDto: UpdateBlogDto) {
		return this.blogService.updateStatus(updateBlogDto, id);
	}

	@Public()
	@Patch('add-comment/:id')
	@ApiOperation({
		summary: 'add comment Blog',
	})
	@ApiParam({ name: 'id', type: String, description: 'Blog ID' })
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	addComment(@Param('id') id, @Body() commentDto: CreateCommentDto) {
		return this.blogService.addComment(id, commentDto);
	}

	@Public()
	@Delete(':id')
	@ApiOperation({
		summary: 'Delete a Blog',
	})
	@ApiParam({ name: 'id', type: String, description: 'Blog ID' })
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
		description: 'Blog not found!',
	})
	deleteBlog(@Param() id: string) {
		return this.blogService.deleteOne(id);
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
		return this.blogService.deleteMany();
	}
}
