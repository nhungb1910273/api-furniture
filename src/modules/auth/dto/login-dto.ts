import { CreateUserDto } from 'src/modules/users/dto/create-user-dto';
import { PickType } from '@nestjs/swagger';

export class LoginDto extends PickType(CreateUserDto, [
	'email',
	'password',
] as const) {}
