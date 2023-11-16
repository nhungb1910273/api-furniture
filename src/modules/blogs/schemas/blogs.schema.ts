import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from 'src/modules/categories/schemas/categories.schema';
import { Photo, PhotoSchema } from 'src/modules/photos/schemas/photo.schema';
import { RoomFurniture } from 'src/modules/room-furnitures/schemas/room-furnitures.schema';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type BlogDocument = HydratedDocument<Blog>;

export enum BlogStatus {
	Approve = 'Approve',
	Unapproved = 'Unapproved',
}

@Schema({ timestamps: true })
export class Blog extends BaseObject {
	@Prop({ type: String, required: true, minlength: 2, maxlength: 50 })
	name: string;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category',
	})
	category: Category;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'RoomFurniture',
	})
	roomFurniture: RoomFurniture;

	@Prop({ type: String, required: true, minlength: 2, maxlength: 50 })
	actor: string;

	@Prop({ type: String, required: true, minlength: 2, maxlength: 50 })
	description: string;

	@Prop({ type: String, required: true, minlength: 2, maxlength: 50 })
	content: string;

	@Prop({ type: Boolean, default: true })
	isNew: boolean;

	@Prop({ type: Number })
	view: number;

	@Prop({
		type: [{ type: PhotoSchema }],
	})
	photos?: Photo[];

	@Prop({
		enum: BlogStatus,
		default: BlogStatus.Unapproved,
		type: String,
	})
	status: BlogStatus;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
