import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ProviderStatus } from '../schemas/providers.schema';
import { CreateAddressDto } from 'src/modules/address/dto/create-address.dto';

export class CreateProviderDto {
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	email: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	phoneNumber: string;

	@IsOptional()
	address: CreateAddressDto;

	@IsOptional()
	@IsString()
	status: ProviderStatus;
}
