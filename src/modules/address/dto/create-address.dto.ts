import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAddressDto {
	@IsString()
	@IsNotEmpty()
	street: string;

	@IsString()
	@IsNotEmpty()
	province: string;

	@IsString()
	@IsNotEmpty()
	provinceCode: string;

	@IsString()
	@IsNotEmpty()
	district: string;

	@IsString()
	@IsNotEmpty()
	districtCode: string;

	@IsString()
	@IsNotEmpty()
	commune: string;

	@IsString()
	@IsNotEmpty()
	communeCode: string;
}
