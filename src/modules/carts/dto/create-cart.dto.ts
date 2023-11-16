import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateDetailCartDto } from 'src/modules/detail-carts/dto/create-detail-cart.dto';

export class CreateCartDto {
	@ApiProperty()
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	user: string;

	@ApiProperty({ required: false, default: 0 })
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	totalPrice: number;

	@IsOptional()
	detailCarts?: CreateDetailCartDto[];
}
