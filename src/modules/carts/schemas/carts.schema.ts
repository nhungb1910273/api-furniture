import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DetailCart } from 'src/modules/detail-carts/schemas/detail-carts.schema';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart extends BaseObject {
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	})
	user: string;

	@Prop({ type: Number })
	totalPrice: number;

	@Prop({
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'DetailCart',
				required: true,
			},
		],
	})
	detailCarts: DetailCart[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
