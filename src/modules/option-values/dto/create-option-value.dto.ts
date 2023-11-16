import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Photo } from 'src/modules/photos/schemas/photo.schema';

export class CreateOptionValueDto {
	@ApiProperty()
	@IsNotEmpty()
	optionSku: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty({ type: 'string', format: 'binary' })
	@IsOptional()
	photo: Photo;
}
