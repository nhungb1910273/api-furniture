import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PermissionStatus } from '../schemas/permissions.schema';

export class CreatePermissionDto {
	@ApiProperty()
	@IsOptional()
	@IsString()
	name: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	code: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	description: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	groupPermission: string;

	@ApiProperty({
		enum: PermissionStatus,
		default: PermissionStatus.Active,
		required: false,
	})
	@IsOptional()
	status: PermissionStatus;
}
