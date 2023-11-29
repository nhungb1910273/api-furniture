import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Blog } from 'src/modules/blogs/schemas/blogs.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type CommentDocument = HydratedDocument<Comment>;

export enum CommentStatus {
	Approved = 'Approved',
	UnApproved = 'UnApproved',
}
@Schema({
	timestamps: true,
})

// ProductDetail
export class Comment extends BaseObject {
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Blog',
		required: true,
	})
	blog: string;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	})
	user: User;

	@Prop({ type: String, required: true })
	comment: string;

	@Prop({
		enum: CommentStatus,
		default: CommentStatus.UnApproved,
		type: String,
	})
	status: CommentStatus;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
