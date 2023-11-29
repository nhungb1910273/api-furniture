import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Bill } from 'src/modules/bills/schemas/bills.schema';
import { Photo, PhotoSchema } from 'src/modules/photos/schemas/photo.schema';
import { ProductSku } from 'src/modules/product-skus/schemas/product-skus.schemas';
import { User } from 'src/modules/users/schemas/user.schema';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type ReviewDocument = HydratedDocument<Review>;

export enum ReviewStatus {
	Approved = 'Approved',
	UnApproved = 'UnApproved',
}

@Schema({ timestamps: true })
export class Review extends BaseObject {
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	})
	user: User;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Bill',
		required: true,
	})
	bill: Bill;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ProductSku',
		required: true,
	})
	productSku: string;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product',
		required: true,
	})
	product: string;

	@Prop({ type: String, required: true, minlength: 2 })
	content: string;

	@Prop({
		type: Number,
		required: true,
		default: 0,
	})
	rating: number;

	@Prop({
		type: [{ type: PhotoSchema }],
	})
	photos?: Photo[];

	@Prop({
		enum: ReviewStatus,
		default: ReviewStatus.UnApproved,
		type: String,
	})
	status: ReviewStatus;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
