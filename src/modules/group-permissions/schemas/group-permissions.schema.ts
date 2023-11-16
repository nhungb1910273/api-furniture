import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseObject } from '../../../shared/schemas/base-object.schema';

export type GroupPermissionDocument = HydratedDocument<GroupPermission>;

@Schema({
	timestamps: true,
	toJSON: {
		virtuals: true,
	},
})
export class GroupPermission extends BaseObject {
	@Prop({
		required: true,
		unique: true,
		type: String,
		minlength: 2,
		maxlength: 40,
	})
	name: string;

	@Prop({ type: String, minlength: 0, maxlength: 200, default: '' })
	description?: string;
}

export const GroupPermissionSchema =
	SchemaFactory.createForClass(GroupPermission);

GroupPermissionSchema.virtual('permissions', {
	ref: 'Permission',
	localField: '_id',
	foreignField: 'groupPermission',
	justOne: false,
});
