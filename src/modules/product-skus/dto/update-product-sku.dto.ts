import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Photo } from 'src/modules/photos/schemas/photo.schema';
import { CreateProductSkuDto } from './create-product-sku.dto';

export class UpdateProductSkuDto extends PartialType(CreateProductSkuDto) {
	@ApiProperty({ format: 'binary' })
	@IsOptional()
	// @Transform(({ value }) => JSON.parse(value))
	photoUpdates?: Photo[];
}
