import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDetailCartDto {
	@IsNotEmpty()
	@IsString()
	productSku: string;

	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNumber()
	@IsOptional()
	quantity: number;
}
