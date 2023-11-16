import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ProductSku } from 'src/modules/product-skus/schemas/product-skus.schemas';
import { WarehouseReceipt } from 'src/modules/warehouse-receipts/schemas/warehouse-receipts.schema';
import { BaseObject } from '../../../shared/schemas/base-object.schema';

export type WarehouseReceiptDetailDocument =
	HydratedDocument<WarehouseReceiptDetail>;

@Schema({ timestamps: true })
export class WarehouseReceiptDetail extends BaseObject {
	@Prop({
		type: String,
		required: true
	})
	name: string;

	@Prop({
		type: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'ProductSku',
			required: true,
		},
	})
	productSku: ProductSku;

	@Prop({ type: Number })
	quantity: number;

	@Prop({ type: Number })
	price: number;
}

export const WarehouseReceiptDetailSchema = SchemaFactory.createForClass(
	WarehouseReceiptDetail,
);
