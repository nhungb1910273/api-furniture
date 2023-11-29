import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWarehouseReceiptDetailDto {
	@ApiProperty()
	@IsOptional()
	@IsString()
	productSku: string;

	@ApiProperty({ required: true })
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	quantity: number;

	@ApiProperty({ required: true })
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	price: number;

	@IsOptional()
	name: string;
}
