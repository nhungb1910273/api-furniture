import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseObject } from '../../../shared/schemas/base-object.schema';
import { Provider } from 'src/modules/providers/schemas/providers.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import { WarehouseReceiptDetail } from 'src/modules/warehouse-receipt-details/schemas/warehouse-receipt-details.schema';

export type WarehouseReceiptDocument = HydratedDocument<WarehouseReceipt>;

export enum WRStatus {
	Approved = 'Approved',
	UnApproved = 'UnApproved',
}
@Schema({ timestamps: true })
export class WarehouseReceipt extends BaseObject {
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	})
	user: User;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Provider',
		required: true,
	})
	provider: Provider;

	@Prop({
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'WarehouseReceiptDetail',
				required: true,
				default: [],
			},
		],
	})
	warehouseReceiptDetails: WarehouseReceiptDetail[];

	// @Prop({ type: Date })
	// importDate: Date;

	@Prop({ type: Date, default: null })
	confirmationDate: Date;

	@Prop({
		type: String,
		required: false,
	})
	note: string;

	@Prop({ type: Number })
	totalPrice: number;

	@Prop({
		default: WRStatus.UnApproved,
		enum: WRStatus,
		type: String,
	})
	status: WRStatus;
}

export const WarehouseReceiptSchema =
	SchemaFactory.createForClass(WarehouseReceipt);
