import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { OptionValue } from 'src/modules/option-values/schemas/option-values.schemas';
import { Option } from 'src/modules/options/schemas/options.schema';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type SkuValueDocument = HydratedDocument<SkuValue>;

@Schema({
	timestamps: true,
})
export class SkuValue extends BaseObject {
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Option',
		required: true,
	})
	optionSku: Option;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'OptionValue',
		required: true,
	})
	optionValue: OptionValue;
}

export const SkuValueSchema = SchemaFactory.createForClass(SkuValue);
