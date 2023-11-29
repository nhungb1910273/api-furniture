import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CommentStatus } from '../schemas/comments.schemas';

export class CreateCommentDto {
	@ApiProperty()
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	user: string;

	@ApiProperty()
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	blog: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	comment: string;

	@ApiProperty({
		enum: CommentStatus,
		default: CommentStatus.UnApproved,
		required: false,
	})
	@IsOptional()
	status: CommentStatus;
}
