import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { OptionValue } from 'src/modules/option-values/schemas/option-values.schemas';
import { Option } from 'src/modules/options/schemas/options.schema';

export class CreateOptionNullDto {
	@ApiProperty()
	@IsOptional()
	optionSku: Option;

	@ApiProperty()
	@IsOptional()
	optionValues: OptionValue[];
}
