import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseObject } from '../../../shared/schemas/base-object.schema';
import { GroupPermission } from 'src/modules/group-permissions/schemas/group-permissions.schema';

export type PermissionDocument = HydratedDocument<Permission>;
export enum PermissionStatus {
	Active = 'Active',
	Inactive = 'Inactive',
}
@Schema({ timestamps: true })
export class Permission extends BaseObject {
	@Prop({
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		ref: 'GroupPermission',
	})
	groupPermission: GroupPermission;

	@Prop({
		required: true,
		type: String,
		minlength: 2,
		maxlength: 40,
	})
	name: string;

	@Prop({
		required: true,
		unique: true,
		type: String,
	})
	code: string;

	@Prop({ type: String, minlength: 0, maxlength: 200 })
	description?: string;

	@Prop({
		enum: PermissionStatus,
		default: PermissionStatus.Active,
		type: String,
	})
	status: PermissionStatus;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
