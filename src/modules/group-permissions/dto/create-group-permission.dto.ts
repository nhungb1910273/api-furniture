import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGroupPermissionDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsString()
	@IsOptional()
	description: string;
}
