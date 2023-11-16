import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductSku } from 'src/modules/product-skus/schemas/product-skus.schemas';

export class CreateBillItemDto {
	@IsNotEmpty()
	@IsString()
	productSkuId: string;

	@IsNumber()
	@IsOptional()
	price: number;

	@IsNumber()
	@IsOptional()
	totalPrice: number;

	@IsNumber()
	@IsOptional()
	quantity: number;

	@IsOptional()
	name: string;

	// @IsOptional()
	// skuValues: SkuValue[];

	@IsOptional()
	@Type(() => ProductSku)
	productSku?: ProductSku;
}
