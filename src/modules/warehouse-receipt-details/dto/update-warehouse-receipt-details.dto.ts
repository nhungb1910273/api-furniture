import { PartialType } from '@nestjs/swagger';
import { CreateWarehouseReceiptDetailDto } from './create-warehouse-receipt-detail.dto';

export class UpdateWarehouseReceipDetailtDto extends PartialType(
	CreateWarehouseReceiptDetailDto,
) {}
