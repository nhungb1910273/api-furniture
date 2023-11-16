import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	ArrayMaxSize,
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { Photo } from 'src/modules/photos/schemas/photo.schema';
import { ReviewStatus } from '../schemas/reviews.shemas';

export class CreateReviewDto {
	@ApiProperty()
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	user: string;

	@ApiProperty()
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	product: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	content: string;

	@ApiProperty({ format: 'binary' })
	@IsOptional()
	@IsArray()
	@ArrayMaxSize(5)
	photos: Photo[];

	@ApiProperty({ required: false, default: 0 })
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	rating: number;

	@ApiProperty({
		enum: ReviewStatus,
		default: ReviewStatus.Unapproved,
		required: false,
	})
	@IsOptional()
	status: ReviewStatus;
}
