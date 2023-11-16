import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseObject } from '../../../shared/schemas/base-object.schema';

export type ShippingDocument = HydratedDocument<Shipping>;

export enum ShippingStatus {
	Active = 'Active',
	Inactive = 'Inactive',
}
@Schema({ timestamps: true })
export class Shipping extends BaseObject {
	@Prop({ type: String })
	provinceApply: string;

	@Prop({ type: Number })
	price: number;

	@Prop({
		default: ShippingStatus.Active,
		enum: ShippingStatus,
		type: String,
	})
	status: ShippingStatus;
}

export const ShippingSchema = SchemaFactory.createForClass(Shipping);
