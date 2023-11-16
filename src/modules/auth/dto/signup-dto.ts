import { CreateUserDto } from 'src/modules/users/dto/create-user-dto';
import { PartialType, OmitType } from '@nestjs/swagger';

export class SignupDto extends PartialType(
	OmitType(CreateUserDto, ['status'] as const),
) {}
