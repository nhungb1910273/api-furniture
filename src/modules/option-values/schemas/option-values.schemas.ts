import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Option } from 'src/modules/options/schemas/options.schema';
import { Photo, PhotoSchema } from 'src/modules/photos/schemas/photo.schema';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type OptionValueDocument = HydratedDocument<OptionValue>;

@Schema({
	timestamps: true,
})
export class OptionValue extends BaseObject {
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Option',
		required: true,
	})
	optionSku: Option;

	@Prop({ type: String, required: true })
	name: string;
	// red, black, 18'', 19''

	@Prop({ type: PhotoSchema, require: false })
	photo: Photo;
}

export const OptionValueSchema = SchemaFactory.createForClass(OptionValue);
