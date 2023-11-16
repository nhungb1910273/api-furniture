import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { OptionValue } from 'src/modules/option-values/schemas/option-values.schemas';
import { Option } from 'src/modules/options/schemas/options.schema';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type OptionNullDocument = HydratedDocument<OptionNull>;

@Schema({
	timestamps: true,
	// toJSON: {
	// 	virtuals: true,
	// },
})
export class OptionNull extends BaseObject {
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Option',
		required: true,
	})
	optionSku: Option;

	@Prop({
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'OptionValue',
				required: true,
			},
		],
	})
	optionValues: OptionValue;
}

export const OptionNullSchema = SchemaFactory.createForClass(OptionNull);
