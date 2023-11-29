import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateBillItemDto } from 'src/modules/bill-items/dto/create-bill-item.dto';
import { UserAddressDto } from 'src/modules/users/dto/user-address.dto';
import { BillPaymentMethod, BillStatus } from '../schemas/bills.schema';
import { Promotion } from 'src/modules/promotions/schemas/promotions.schema';

export class CreateBillDto {
	@ApiProperty()
	// @IsNotEmpty()
	@IsOptional()
	@IsString()
	@Type(() => String)
	// @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
	user: string;

	@ApiProperty()
	@IsOptional()
	// @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
	promotion?: Promotion;

	@ApiProperty()
	@IsOptional()
	@IsString()
	@Type(() => String)
	number: string;

	@ApiProperty()
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	grandTotal: number;

	@ApiProperty()
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	installationCost?: number;

	@ApiProperty()
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	price: number;

	@ApiProperty()
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	promotionPrice?: number;

	@ApiProperty()
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	shipping?: number;

	@ApiProperty()
	@IsOptional()
	@IsString()
	@Type(() => String)
	message: string;

	@ApiProperty()
	@IsOptional()
	@Type(() => UserAddressDto)
	// @Transform(({ value }) => JSON.parse(value))
	address: UserAddressDto;

	@ApiProperty()
	@IsOptional()
	// @IsNotEmpty()
	@Type(() => CreateBillItemDto)
	// @Transform(({ value }) => JSON.parse(value))
	// @Transform(({ value }) => Array.isArray(value))
	billItems?: CreateBillItemDto[];

	@ApiProperty()
	@IsOptional()
	// @IsEnum(BillPaymentMethod)
	paymentMethod: BillPaymentMethod;

	@ApiProperty()
	@IsOptional()
	// @IsEnum(BillStatus)
	status: BillStatus;
}
