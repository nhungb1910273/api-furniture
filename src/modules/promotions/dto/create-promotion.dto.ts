import {
	IsDate,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	MinDate,
} from 'class-validator';
import { PromotionStatus, PromotionType } from '../schemas/promotions.schema';
import { Transform } from 'class-transformer';

export class CreatePromotionDto {
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	couponCode: string;

	@IsOptional()
	@IsNumber()
	@IsNotEmpty()
	quantity: number;

	@IsOptional()
	@IsNumber()
	@IsNotEmpty()
	priceMinimumApply: number;

	@IsOptional()
	@IsNumber()
	percentDiscount: number;

	@IsOptional()
	@IsNumber()
	priceMaximumByPercent: number;

	@IsOptional()
	@IsNumber()
	numberDiscountByNumber: number;

	@IsNotEmpty()
	@Transform(({ value }) => new Date(value))
	@IsDate()
	// @MinDate(new Date())
	dateExpire: Date;

	@IsNotEmpty()
	@Transform(({ value }) => new Date(value))
	@IsDate()
	// @MinDate(new Date())
	dateApply: Date;

	@IsOptional()
	@IsString()
	description: string;

	@IsOptional()
	@IsString()
	type: PromotionType;

	@IsOptional()
	@IsString()
	status: PromotionStatus;
}
