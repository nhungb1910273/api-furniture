import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsBoolean,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';

export class CreateProductDto {
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
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	description: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	content: string;

	// @ApiProperty({ required: false, default: 0 })
	// @IsOptional()
	// @IsNumber()
	// @Type(() => Number)
	// view?: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	installationCost?: number;

	@ApiProperty()
	@IsOptional()
	@IsBoolean()
	isArrival: boolean;

	@ApiProperty()
	@IsOptional()
	@IsBoolean()
	isHidden: boolean;

	// @ApiProperty()
	// @IsOptional()
	// @IsBoolean()
	// isFavorite: boolean;
}
