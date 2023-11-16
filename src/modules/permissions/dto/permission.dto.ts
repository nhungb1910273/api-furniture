import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class PermissionDto {
	@ApiProperty()
	@IsString()
	_id: string;

	@ApiProperty()
	@IsBoolean()
	active: boolean;
}
