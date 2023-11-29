import { PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
	// @IsOptional()
	// @IsArray()
	// @IsString({ each: true })
	// deletedImages?: string[];
}
