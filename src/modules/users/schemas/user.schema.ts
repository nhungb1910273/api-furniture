import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseObject } from '../../../shared/schemas/base-object.schema';
import { UserAddress } from './user-address.schema';
import { Photo, PhotoSchema } from 'src/modules/photos/schemas/photo.schema';
import { Role } from 'src/modules/roles/schemas/roles.schema';
import { Product } from 'src/modules/products/schemas/products.schema';

export type UserDocument = HydratedDocument<User>;

export enum UserStatus {
	Active = 'Active',
	Inactive = 'Inactive',
}

export enum UserType {
	Personnel = 'Personnel',
	Customer = 'Customer',
}

export enum UserGender {
	Female = 'Female',
	Male = 'Male',
	Other = 'Other',
}

@Schema({ timestamps: true })
export class User extends BaseObject {
	@Prop({
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Role',
				required: false,
			},
		],
	})
	roles?: Role[];

	@Prop({
		required: true,
		unique: true,
		type: String,
		minlength: 2,
		maxlength: 80,
	})
	username: string;

	@Prop({
		required: true,
		unique: true,
		type: String,
		lowercase: true,
		match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
	})
	email: string;

	@Prop({ required: true, minlength: 6 })
	password: string;

	@Prop({ required: false, minlength: 6 })
	repeatPassword?: string;

	@Prop({ default: null, type: String })
	refreshToken: string;

	@Prop({ type: String, minlength: 2, maxlength: 20 })
	firstName?: string;

	@Prop({ type: String, minlength: 2, maxlength: 40 })
	lastName?: string;

	@Prop({ enum: UserGender, type: String, default: UserGender.Female })
	gender?: UserGender;

	@Prop({ enum: UserType, type: String, default: UserType.Customer })
	userType: UserType;

	// @Prop({ type: Date })
	// birthDate?: Date;

	@Prop({
		type: String,
		maxlength: 10,
		minlength: 8,
		match: /^\d+$/,
	})
	phoneNumber?: string;

	@Prop([
		{
			type: UserAddress,
		},
	])
	address?: UserAddress[];

	@Prop({ type: PhotoSchema })
	avatar?: Photo;

	@Prop({ default: UserStatus.Active, enum: UserStatus, type: String })
	status: UserStatus;

	@Prop({
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Product',
				required: false,
				default: [],
			},
		],
	})
	products?: Product[];
}

export const UserSchema = SchemaFactory.createForClass(User);
