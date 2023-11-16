import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type ProvinceDocument = HydratedDocument<Province>;

@Schema({ timestamps: true })
export class Province extends BaseObject {
	@Prop({ required: true, unique: true })
	name: string;

	@Prop({ required: true })
	code: string;
}

export const ProvinceSchema = SchemaFactory.createForClass(Province);
