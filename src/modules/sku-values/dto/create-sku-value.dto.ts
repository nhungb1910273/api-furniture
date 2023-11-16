import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateSkuValueDto {
	@ApiProperty()
	@IsOptional()
	@IsString()
	optionSku: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	optionValue: string;
}
