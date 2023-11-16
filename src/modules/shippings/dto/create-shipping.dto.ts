import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ShippingStatus } from '../schemas/shippings.schema';

export class CreateShippingDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsOptional()
	@IsString()
	provinceApply: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsOptional()
	@IsNumber()
	price: number;

	@ApiProperty({ enum: ShippingStatus, default: ShippingStatus.Active })
	@IsOptional()
	status: string;
}
