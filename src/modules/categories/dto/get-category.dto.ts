import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { DefaultListDto } from 'src/shared/dto/default-list-dto';

export class GetCategoryDto extends DefaultListDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	roomFurniture: string;
}
