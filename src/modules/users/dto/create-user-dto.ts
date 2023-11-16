import {
	IsDate,
	IsEmail,
	IsEnum,
	IsMobilePhone,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
	ValidateNested,
} from 'class-validator';
import { UserGender, UserStatus, UserType } from '../schemas/user.schema';
import { UserAddressDto } from './user-address.dto';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
	// @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
	// @IsArray()
	roles: string[];

	@IsNotEmpty()
	@IsString()
	@MinLength(2)
	@MaxLength(80)
	username: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	password: string;

	@IsString()
	@MinLength(8)
	repeatPassword?: string;

	@IsOptional()
	@IsString()
	@MinLength(2)
	@MaxLength(80)
	firstName?: string;

	@IsOptional()
	@IsString()
	@MinLength(2)
	@MaxLength(80)
	lastName?: string;

	@IsOptional()
	@IsEnum(UserGender)
	gender?: UserGender;

	@IsOptional()
	@IsMobilePhone('vi-VN')
	phoneNumber: string;

	@IsOptional()
	// @ValidateNested()
	// @Type(() => UserAddressDto)
	address?: UserAddressDto[];

	@IsEnum(UserType)
	@ApiProperty({
		enum: UserType,
		default: UserType.Customer,
	})
	userType: UserType;

	@IsOptional()
	@IsEnum(UserStatus)
	status?: UserStatus;
}
