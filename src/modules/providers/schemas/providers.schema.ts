import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseObject } from '../../../shared/schemas/base-object.schema';
import { UserAddress } from 'src/modules/users/schemas/user-address.schema';

export type ProviderDocument = HydratedDocument<Provider>;

export enum ProviderStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}
@Schema({ timestamps: true })
export class Provider extends BaseObject {
	@Prop({ type: String })
	name: string;

	@Prop({
		required: true,
		unique: true,
		type: String,
		lowercase: true,
		match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
	})
	email: string;

	@Prop({
		type: String,
		maxlength: 10,
		minlength: 8,
		match: /^\d+$/,
	})
	phoneNumber?: string;

	@Prop({ type: UserAddress })
	address?: UserAddress;

	@Prop({ default: ProviderStatus.ACTIVE, enum: ProviderStatus, type: String })
	status: ProviderStatus;
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);
