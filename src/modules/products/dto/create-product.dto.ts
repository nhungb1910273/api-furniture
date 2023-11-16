import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
	IsBoolean,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { CreateOptionNullDto } from 'src/modules/sku-values/dto/create-option-null.dto';
import { OptionNull } from 'src/modules/sku-values/schemas/option-null.schema';
import { SkuValue } from 'src/modules/sku-values/schemas/sku-values.schemas';

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

	@ApiProperty({ required: false, default: 0 })
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	view?: number;

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

	@ApiProperty()
	@IsOptional()
	@IsBoolean()
	isFavorite: boolean;

	@IsOptional()
	// @Type(() => CreateSkuValueDto)
	// @ValidateNested({ each: true })
	@Transform(({ value }) => JSON.parse(value))
	skuValues?: CreateOptionNullDto[];
}
