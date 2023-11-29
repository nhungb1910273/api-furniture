import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
	ArrayMaxSize,
	IsArray,
	IsBoolean,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { Photo } from 'src/modules/photos/schemas/photo.schema';
import { BlogStatus } from '../schemas/blogs.schema';

export class CreateBlogDto {
	@ApiProperty()
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	roomFurniture: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	category: string;

	@ApiProperty()
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	actor: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	description: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	content: string;

	@ApiProperty({ format: 'binary' })
	@Transform(({ value }) => JSON.parse(value))
	@IsOptional()
	@IsArray()
	@ArrayMaxSize(5)
	photos: Photo[];

	@ApiProperty({ required: false, default: 0 })
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	view: number;

	@ApiProperty()
	@IsOptional()
	isNew: boolean;

	@ApiProperty({
		enum: BlogStatus,
		default: BlogStatus.UnApproved,
		required: false,
	})
	@IsOptional()
	status: BlogStatus;
}
