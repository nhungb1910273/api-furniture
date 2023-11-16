import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
	@ApiProperty()
	@IsNotEmpty()
	@Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
	permissions: string[];

	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsString()
	description: string;
}
