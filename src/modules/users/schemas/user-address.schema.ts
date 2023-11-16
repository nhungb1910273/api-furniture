import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseObject } from '../../../shared/schemas/base-object.schema';

export type UserAddressDocument = HydratedDocument<UserAddress>;

@Schema({ timestamps: true })
export class UserAddress extends BaseObject {
	@Prop({ require: true, minlength: 0, maxlength: 50 })
	province: string;

	@Prop({ require: true, minlength: 0, maxlength: 50 })
	district: string;

	@Prop({ require: true, minlength: 0, maxlength: 50 })
	commune: string;

	@Prop({ type: String })
	addressDetail: string;

	@Prop({ type: Boolean })
	isDefault: boolean;
}

export const UserAddressSchema = SchemaFactory.createForClass(UserAddress);
