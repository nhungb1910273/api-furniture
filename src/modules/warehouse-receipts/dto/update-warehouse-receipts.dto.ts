import { PartialType } from '@nestjs/swagger';
import { CreateWarehouseReceiptDto } from './create-warehouse-receipts.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateWarehouseReceiptDto extends PartialType(
	CreateWarehouseReceiptDto,
) {
	@IsOptional()
	@IsString()
	id?: string;
}
