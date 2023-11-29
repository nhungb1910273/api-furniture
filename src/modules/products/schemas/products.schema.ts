import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from 'src/modules/categories/schemas/categories.schema';
import { RoomFurniture } from 'src/modules/room-furnitures/schemas/room-furnitures.schema';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type ProductDocument = HydratedDocument<Product>;

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
export class Product extends BaseObject {
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category',
	})
	category: Category;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'RoomFurniture',
	})
	roomFurniture: RoomFurniture;

	// @Prop({
	// 	type: [{ type: OptionNullSchema, required: false, default: [] }],
	// })
	// skuValues?: OptionNull[];

	@Prop({ type: String, require: true })
	name: string;

	@Prop({ type: String, require: true })
	description: string;

	@Prop({ type: String, require: true })
	content: string;

	// @Prop({ type: Number, require: false })
	// view?: number;

	@Prop({ type: Number, require: false, default: 0 })
	installationCost?: number;

	@Prop({ type: Boolean, default: true })
	isArrival: boolean;

	@Prop({ type: Boolean, default: false })
	isHidden: boolean;

	// @Prop({ type: Boolean, default: false })
	// isFavorite: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.virtual('productSkus', {
	ref: 'ProductSku',
	localField: '_id',
	foreignField: 'product',
	justOne: false,
});
