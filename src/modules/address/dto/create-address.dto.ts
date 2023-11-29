import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAddressDto {
	@IsString()
	@IsNotEmpty()
	addressDetail: string;

	@IsString()
	isDefault: string;

	@IsString()
	@IsNotEmpty()
	province: string;

	@IsString()
	@IsNotEmpty()
	district: string;

	@IsString()
	@IsNotEmpty()
	commune: string;
}
