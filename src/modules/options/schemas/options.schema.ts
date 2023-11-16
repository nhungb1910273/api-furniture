import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type OptionDocument = HydratedDocument<Option>;
export enum DisplayOption {
	OPTION_TEXT = 'OPTION_TEXT',
	OPTION_PHOTO = 'OPTION_PHOTO',
}

@Schema({
	timestamps: true,
	toJSON: {
		virtuals: true,
		versionKey: false,
		transform: function (doc, ret) {
			if (ret.id) {
				ret._id = ret.id;
				delete ret.id;
			}
		},
	},
})
export class Option extends BaseObject {
	// @Prop({
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: 'Product',
	// })
	// product: Product;

	@Prop({ type: String, required: true })
	name: string;
	// color, material, size, length

	@Prop({
		type: String,
		required: true,
		default: DisplayOption.OPTION_TEXT,
	})
	displayOption: DisplayOption;
}

export const OptionSchema = SchemaFactory.createForClass(Option);

OptionSchema.virtual('optionValues', {
	ref: 'OptionValue',
	localField: '_id',
	foreignField: 'optionSku',
	justOne: false,
});
