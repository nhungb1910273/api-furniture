import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Photo } from 'src/modules/photos/schemas/photo.schema';

export class CreateProductSkuDto {
	@ApiProperty()
	@IsOptional()
	@IsString()
	product: string;

	@ApiProperty()
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	price: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	priceDiscount?: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	percent?: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	quantitySold?: number;

	@ApiProperty()
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	@IsNotEmpty()
	quantityInStock: number;

	@ApiProperty()
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	numberSKU: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	content: string;

	@ApiProperty({ format: 'binary' })
	@IsOptional()
	@Transform(({ value }) => JSON.parse(value))
	photos: Photo[];

	@ApiProperty()
	@IsOptional()
	// @IsNotEmpty()
	@Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
	// @IsArray()
	optionValues: string[];
}
