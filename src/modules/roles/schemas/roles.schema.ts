import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseObject } from '../../../shared/schemas/base-object.schema';
import { Permission } from 'src/modules/permissions/schemas/permissions.schema';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role extends BaseObject {
	@Prop({
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Permission',
				required: true,
			},
		],
	})
	permissions: Permission[];

	@Prop({
		required: true,
		unique: true,
		type: String,
		minlength: 2,
		maxlength: 40,
	})
	name: string;

	@Prop({ type: String })
	description?: string;

	totalUser?: number;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
