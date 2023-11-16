import { PickType } from '@nestjs/swagger';
import { UpdateUserDto } from './update-user-dto';

export class UpdateLoggedUserDataDto extends PickType(UpdateUserDto, [
	'username',
	'email',
	'username',
	'firstName',
	'lastName',
	'gender',
	'phoneNumber',
	'address',
] as const) {}
