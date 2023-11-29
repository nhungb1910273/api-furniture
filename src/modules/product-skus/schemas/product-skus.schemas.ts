import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { OptionValue } from 'src/modules/option-values/schemas/option-values.schemas';
import { Photo, PhotoSchema } from 'src/modules/photos/schemas/photo.schema';
import { Product } from 'src/modules/products/schemas/products.schema';
import { Review } from 'src/modules/reviews/schemas/reviews.shemas';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type ProductSkuDocument = HydratedDocument<ProductSku>;

@Schema({
	timestamps: true,
})
// ProductDetail
export class ProductSku extends BaseObject {
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product',
		required: true,
	})
	product: Product;

	@Prop({ type: Number, required: true })
	price: number;

	@Prop({ type: Number, required: false })
	priceDiscount?: number;

	@Prop({ type: Number, required: false })
	percent?: number;

	@Prop({ type: Number, required: false })
	quantitySold?: number;

	@Prop({ type: Number, required: true })
	quantityInStock: number;

	@Prop({ type: String, required: true })
	numberSKU: string;

	@Prop({ type: String })
	content?: string;

	@Prop({
		type: [{ type: PhotoSchema }],
	})
	photos: Photo[];

	// @Prop({
	// 	type: [{ type: SkuValueSchema }],
	// })
	// skuValues: SkuValue[];
	@Prop([
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'OptionValue',
			required: true,
		},
	])
	optionValues: OptionValue[];

	// @Prop({
	// 	type: [{ type: ReviewSchema, required: false }],
	// 	default: [],
	// })
	// reviews?: Review[];
	@Prop([
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Review',
			required: true,
		},
	])
	reviews: Review[];

	// gồm < 3 object option: color, size, ....
}

export const ProductSkuSchema = SchemaFactory.createForClass(ProductSku);

// skuValues : [
//     {
//         option: {
//             name: "color"
//         },
//         optionValue: {
//             name: "red",
//             photo: Photo
//         }
//     },
//     {
//         option: {
//             name: "size"
//         },
//         optionValue: {
//             name: 18,
//             photo: Photo
//         }
//     }
// ]
