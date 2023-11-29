import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateProductFavoriteDto {
	@ApiProperty()
	@IsOptional()
	product: string;
}
