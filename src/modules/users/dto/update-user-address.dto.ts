import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user-dto';

export class UpdateUserAddressDto extends PickType(CreateUserDto, [
	'address',
] as const) {}
