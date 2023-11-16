import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user-dto';

export class UpdateUserRolesDto extends PickType(CreateUserDto, [
	'roles',
] as const) {}
