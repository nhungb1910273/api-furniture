import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseObject } from '../../../shared/schemas/base-object.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import { UserAddress } from 'src/modules/users/schemas/user-address.schema';
import {
	Promotion,
	PromotionSchema,
} from 'src/modules/promotions/schemas/promotions.schema';
import { BillItem } from 'src/modules/bill-items/schemas/bill-items.schema';

export type BillDocument = HydratedDocument<Bill>;

export enum BillStatus {
	Waiting = 'Waiting',
	Processing = 'Processing',
	Shipping = 'Shipping',
	Success = 'Success',
	Cancel = 'Cancel',
}
export enum BillPaymentMethod {
	Cod = 'Cod',
	Card = 'Card',
}
@Schema({ timestamps: true })
export class Bill extends BaseObject {
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	})
	user: User;

	@Prop({ type: String })
	number: string;

	@Prop({ type: Number })
	grandTotal: number;

	@Prop({ type: Number })
	installationCost?: number;

	@Prop({ type: Number })
	price: number;

	@Prop({ type: Number })
	promotionPrice?: number;

	@Prop({ type: Number, required: false })
	shipping?: number;

	@Prop({ type: String })
	message: string;

	@Prop({ type: UserAddress })
	address: UserAddress;

	@Prop([
		{ type: mongoose.Schema.Types.ObjectId, ref: 'BillItem', default: [] },
	])
	billItems: BillItem[];

	@Prop([
		{
			type: PromotionSchema,
		},
	])
	promotions?: Promotion[];

	@Prop({
		default: BillPaymentMethod.Cod,
		enum: BillPaymentMethod,
		type: String,
	})
	paymentMethod: BillPaymentMethod;

	@Prop({ default: BillStatus.Waiting, enum: BillStatus })
	status: BillStatus;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
