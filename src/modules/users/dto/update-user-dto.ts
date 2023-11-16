import { PartialType, PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user-dto';

export class UpdateUserDto extends PartialType(
	PickType(CreateUserDto, [
		'firstName',
		'lastName',
		'username',
		'gender',
		'phoneNumber',
		'address',
		'roles',
		'status',
	]),
) {
	@IsOptional()
	@IsString()
	refreshToken?: string;
}
