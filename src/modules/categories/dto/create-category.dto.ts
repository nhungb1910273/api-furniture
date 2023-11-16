import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Photo } from 'src/modules/photos/schemas/photo.schema';
import { CategoryStatus } from '../schemas/categories.schema';

export class CreateCategoryDto {
	@ApiProperty()
	@IsNotEmpty()
	@Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
	// @IsArray()
	roomFurnitures: string[];

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	description: string;

	@ApiProperty({ type: 'string', format: 'binary' })
	@IsOptional()
	photo: Photo;

	@ApiProperty({
		enum: CategoryStatus,
		default: CategoryStatus.Active,
		required: false,
	})
	@IsOptional()
	status?: CategoryStatus;
}
