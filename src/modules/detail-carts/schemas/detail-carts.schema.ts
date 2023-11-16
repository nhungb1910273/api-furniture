import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseObject } from '../../../shared/schemas/base-object.schema';

export type DetailCartDocument = HydratedDocument<DetailCart>;

@Schema({
	timestamps: true,
})
export class DetailCart extends BaseObject {
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ProductSku',
	})
	productSku: string;

	@Prop({ type: String, required: true, minlength: 2, maxlength: 50 })
	name: string;

	@Prop({ type: Number, default: 0 })
	quantity: number;
}

export const DetailCartSchema = SchemaFactory.createForClass(DetailCart);
