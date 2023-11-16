import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { DefaultListDto } from 'src/shared/dto/default-list-dto';
import { FilterSearchDto } from './filter-search-dto';

export class GetProductDto extends DefaultListDto {
	@ApiProperty({ isArray: true, type: FilterSearchDto })
	@IsOptional()
	@Type(() => FilterSearchDto)
	filters?: FilterSearchDto[];

	@ApiProperty()
	@IsOptional()
	roomFurniture?: any;
}
