import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
export type PromotionDocument = HydratedDocument<Promotion>;

export enum PromotionStatus {
	Active = 'Active',
	Inactive = 'Inactive',
}

export enum PromotionType {
	Percent = 'Percent',
	Number = 'Number',
}

@Schema({ timestamps: true })
export class Promotion extends BaseObject {
	@Prop({ type: String, required: true })
	name: string;

	@Prop({ type: String, required: true })
	couponCode: string;

	@Prop({ type: Number, required: true })
	quantity: number;

	//  giá áp dụng tối thiểu (tối thiểu 150k mới được giảm giá)
	@Prop({ type: Number, required: true })
	priceMinimumApply: number;

	// giảm giá theo phần trăm
	@Prop({ type: Number, required: false })
	percentDiscount?: number;

	// giá giảm tối đa theo phần trăm
	@Prop({ type: Number, required: false })
	priceMaximumByPercent?: number;

	// giảm giá theo số tiền
	@Prop({ type: Number, required: false })
	numberDiscountByNumber?: number;

	@Prop({ type: Date, required: true })
	dateExpire: Date;

	@Prop({ type: Date, required: true })
	dateApply: Date;

	@Prop({ type: String, required: false })
	description: string;

	@Prop({
		enum: PromotionType,
		default: PromotionType.Number,
		type: String,
		required: true,
	})
	type: PromotionType;

	@Prop({
		enum: PromotionStatus,
		default: PromotionStatus.Active,
		type: String,
	})
	status: PromotionStatus;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
