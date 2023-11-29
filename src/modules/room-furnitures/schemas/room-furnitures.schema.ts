import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Photo, PhotoSchema } from 'src/modules/photos/schemas/photo.schema';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type RoomFurnitureDocument = HydratedDocument<RoomFurniture>;

export enum RoomFurnitureStatus {
	Active = 'Active',
	Inactive = 'Inactive',
}

@Schema({
	timestamps: true,
	toJSON: {
		virtuals: true,
		versionKey: false,
		transform: function (doc, ret) {
			if (ret.id) {
				ret._id = ret.id;
				delete ret.id;
			}
		},
	},
})
export class RoomFurniture extends BaseObject {
	@Prop({ type: String, required: true, minlength: 2 })
	name: string;

	@Prop({ type: String, required: true, minlength: 2 })
	description: string;

	@Prop({ type: PhotoSchema, require: true })
	photo: Photo;

	@Prop({
		enum: RoomFurnitureStatus,
		default: RoomFurnitureStatus.Active,
		type: String,
	})
	status: RoomFurnitureStatus;
}

export const RoomFurnitureSchema = SchemaFactory.createForClass(RoomFurniture);

RoomFurnitureSchema.virtual('categories', {
	ref: 'Category',
	localField: '_id',
	foreignField: 'roomFurnitures',
	justOne: false,
});
