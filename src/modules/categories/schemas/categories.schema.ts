import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Photo, PhotoSchema } from 'src/modules/photos/schemas/photo.schema';
import { RoomFurniture } from 'src/modules/room-furnitures/schemas/room-furnitures.schema';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type CategoryDocument = HydratedDocument<Category>;

export enum CategoryStatus {
	Active = 'Active',
	Inactive = 'Inactive',
}

@Schema({ timestamps: true })
export class Category extends BaseObject {
	@Prop({
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'RoomFurniture',
				required: true,
			},
		],
	})
	roomFurnitures: RoomFurniture[];

	@Prop({ type: String, required: true, minlength: 2 })
	name: string;

	@Prop({ type: String, required: true, minlength: 2 })
	description: string;

	@Prop({ type: PhotoSchema, require: true })
	photo: Photo;

	@Prop({
		enum: CategoryStatus,
		default: CategoryStatus.Active,
		type: String,
	})
	status: CategoryStatus;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
