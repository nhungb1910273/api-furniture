import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from 'src/modules/categories/schemas/categories.schema';
import {
	Comment,
	CommentSchema,
} from 'src/modules/comments/schemas/comments.schemas';
import { Photo, PhotoSchema } from 'src/modules/photos/schemas/photo.schema';
import { RoomFurniture } from 'src/modules/room-furnitures/schemas/room-furnitures.schema';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type BlogDocument = HydratedDocument<Blog>;

export enum BlogStatus {
	Approved = 'Approved',
	UnApproved = 'UnApproved',
}

@Schema({ timestamps: true })
export class Blog extends BaseObject {
	@Prop({ type: String, required: true })
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

	@Prop({ type: String, required: true })
	actor: string;

	@Prop({ type: String, required: true })
	description: string;

	@Prop({ type: String, required: true })
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
		default: BlogStatus.UnApproved,
		type: String,
	})
	status: BlogStatus;

	@Prop({
		type: [{ type: CommentSchema, required: false }],
		default: [],
	})
	comments?: Comment[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
