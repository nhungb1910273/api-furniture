import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PermissionStatus } from '../schemas/permissions.schema';

export class CreatePermissionDto {
	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsString()
	description: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	groupPermission: string;

	@ApiProperty({
		enum: PermissionStatus,
		default: PermissionStatus.ACTIVE,
		required: false,
	})
	@IsOptional()
	status: PermissionStatus;
}
