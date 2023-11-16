import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import { Province } from './province.schema';

export type DistrictDocument = HydratedDocument<District>;

@Schema({ timestamps: true })
export class District extends BaseObject {
	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	code: string;

	@Prop({ type: String, ref: 'Province', required: true })
	province: Province;
}

export const DistrictSchema = SchemaFactory.createForClass(District);
