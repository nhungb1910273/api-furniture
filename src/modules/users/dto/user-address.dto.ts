import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UserAddressDto {
	@IsNotEmpty()
	@IsString()
	province: string;

	@IsNotEmpty()
	@IsString()
	district: string;

	@IsNotEmpty()
	@IsString()
	commune: string;

	@IsNotEmpty()
	@IsString()
	addressDetail: string;

	@IsBoolean()
	isDefault: boolean;
}
