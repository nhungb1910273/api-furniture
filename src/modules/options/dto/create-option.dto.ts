import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { DisplayOption } from '../schemas/options.schema';

export class CreateOptionDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty({
		enum: DisplayOption,
		default: DisplayOption.OPTION_TEXT,
		required: true,
	})
	@IsNotEmpty()
	displayOption: DisplayOption;
}
