import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { WRStatus } from '../schemas/warehouse-receipts.schema';
import { CreateWarehouseReceiptDetailDto } from 'src/modules/warehouse-receipt-details/dto/create-warehouse-receipt-detail.dto';

export class CreateWarehouseReceiptDto {
	@ApiProperty()
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	user: string;

	@ApiProperty()
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	provider: string;

	// @ApiProperty()
	// @IsOptional()
	// importDate: Date;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	note: string;

	@ApiProperty({ required: true })
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	totalPrice: number;

	@ApiProperty({
		isArray: true,
		type: CreateWarehouseReceiptDetailDto,
	})
	@Type(() => CreateWarehouseReceiptDetailDto)
	@IsOptional()
	warehouseReceiptDetails?: CreateWarehouseReceiptDetailDto[];

	@ApiProperty({
		enum: WRStatus,
		default: WRStatus.UnApproved,
		required: false,
	})
	@IsOptional()
	status: WRStatus;
}
