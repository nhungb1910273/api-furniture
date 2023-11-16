import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Photo, PhotoSchema } from 'src/modules/photos/schemas/photo.schema';
import { Product } from 'src/modules/products/schemas/products.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type ReviewDocument = HydratedDocument<Review>;

export enum ReviewStatus {
	Approve = 'Approve',
	Unapproved = 'Unapproved',
}

@Schema({ timestamps: true })
export class Review extends BaseObject {
	@Prop({
		type: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	})
	user: User;

	@Prop({
		type: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
		},
	})
	product: Product;

	@Prop({ type: String, required: true, minlength: 2, maxlength: 50 })
	content: string;

	@Prop({
		type: Number,
		required: false,
		default: 0,
	})
	rating: number;

	@Prop({
		type: [{ type: PhotoSchema }],
	})
	photos?: Photo[];

	@Prop({
		enum: ReviewStatus,
		default: ReviewStatus.Unapproved,
		type: String,
	})
	status: ReviewStatus;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
