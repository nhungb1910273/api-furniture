import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import { District } from './district.schema';

export type CommuneDocument = HydratedDocument<Commune>;

@Schema({ timestamps: true })
export class Commune extends BaseObject {
	@Prop({ type: String, required: true })
	name: string;

	@Prop({ required: true })
	code: string;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'District',
		required: true,
	})
	district: District;
}

export const CommuneSchema = SchemaFactory.createForClass(Commune);
