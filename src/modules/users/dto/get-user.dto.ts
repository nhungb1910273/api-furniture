import { ApiProperty } from '@nestjs/swagger';
// import { IsEnum, IsOptional } from 'class-validator';
import { DefaultListDto } from '../../../shared/dto/default-list-dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
export class GetUserDto extends DefaultListDto {
	// @IsEnum(UserRole)
	// @IsOptional()
	// @ApiProperty({ enum: UserRole, required: false })
	// role?: UserRole;
	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@Transform((val) => parseInt(val.value))
	@IsNumber()
	roleId?: number;
	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsString()
	permissionId?: string;
}
