import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ProductSku } from 'src/modules/product-skus/schemas/product-skus.schemas';
import { Product } from 'src/modules/products/schemas/products.schema';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type BillItemDocument = HydratedDocument<BillItem>;

// export enum BillItemStatus {
// 	ACTIVE = 'ACTIVE',
// 	INACTIVE = 'INACTIVE',
// }

@Schema({ timestamps: true })
export class BillItem extends BaseObject {
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ProductSku',
		required: true,
	})
	productSkuId: string;

	@Prop({ type: Number, required: true })
	price: number;

	@Prop({ type: Number, required: true })
	quantity: number;

	@Prop({ type: Number, required: true })
	totalPrice: number;

	@Prop({ default: 0, type: ProductSku })
	productSku: ProductSku;

	@Prop({ default: 0, type: Product })
	product: Product;

	// @Prop([{ default: 0, type: SkuValue }])
	// skuValues: SkuValue[];
}

export const BillItemSchema = SchemaFactory.createForClass(BillItem);
