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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './schemas/comments.schemas';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
	constructor(private readonly commentService: CommentsService) {}

	// 2 API NÀY TẠM THỜI KHÔNG CẦN THIẾT
	@Post()
	// @ApiBearerAuth()
	@ApiOperation({
		summary: 'Create a new Comment',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	async createComment(@Body() CommentDto: CreateCommentDto) {
		return await this.commentService.create(CommentDto);
	}

	@Public()
	@Delete(':CommentID')
	// @ApiBearerAuth()
	@ApiOperation({
		summary: '(NOTE: API NÀY TẠM THỜI KHÔNG DÙNG) Delete Comment by id',
	})
	@ApiParam({ name: 'CommentID', type: String, description: 'Comment ID' })
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
		description: 'Comment not found!',
	})
	deleteCommentById(@Param('CommentID') CommentID: any) {
		return this.commentService.delete(CommentID);
	}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many Comment',
	})
	@ApiDocsPagination('CommentSchema')
	findMany(@Query() filter: ListOptions<Comment>) {
		return this.commentService.findAll(filter);
	}

	// @Public()
	// findOne(@Param(':id') id) {
	// 	return this.commentService.findOneByID(id);
	// }

	@Public()
	@Get(':CommentID')
	@ApiOperation({
		summary: 'Get many Comment',
	})
	@ApiParam({ name: 'CommentID', type: String, description: 'Comment ID' })
	findOneByID(@Param('CommentID') CommentID) {
		return this.commentService.findOne({
			_id: CommentID,
		});
	}

	@Public()
	@Patch(':id')
	@ApiOperation({
		summary: 'Get many Comment',
	})
	@ApiParam({ name: 'id', type: String, description: 'Comment ID' })
	updateStatus(@Param('id') id, @Body() commentDto: UpdateCommentDto) {
		return this.commentService.updateStatus(commentDto, id);
	}
}
