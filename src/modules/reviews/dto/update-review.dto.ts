import { PartialType, PickType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { CreateReviewDto } from './create-review.dto';

export class UpdateReviewDto extends PartialType(
	PickType(CreateReviewDto, ['rating', 'content']),
) {
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	deletedImages?: string[];
}
