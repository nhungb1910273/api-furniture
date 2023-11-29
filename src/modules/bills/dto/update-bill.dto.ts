import { PartialType } from '@nestjs/swagger';
import { CreateBillDto } from './create-bill.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBillDto extends PartialType(CreateBillDto) {
	@IsOptional()
	@IsString()
	billId?: string;

	@IsOptional()
	requestCancel?: boolean;
}
