import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { SuccessResponse } from 'src/shared/response/success-response';
import { Bill, BillDocument } from './schemas/bills.schema';
import { BillItemsService } from '../bill-items/bill-items.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
@Injectable()
export class BillsService {
	constructor(
		@InjectModel(Bill.name)
		private billModel: Model<BillDocument>,
		private readonly billItemService: BillItemsService,
	) {}

	async findOne(filter: Partial<Bill>): Promise<Bill> {
		try {
			return await this.billModel.findOne(filter).populate('billItems');
		} catch (error) {
			throw new BadRequestException('An error occurred while retrieving Bills');
		}
	}

	async findAll(filter: ListOptions<Bill>): Promise<ListResponse<Bill>> {
		try {
			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.billModel
				.find({ ...filter, user: filter.user })
				.sort(sortQuery)
				.skip(offset)
				.limit(limit)
				.populate('billItems');

			return {
				items: result,
				total: result?.length,
				options: filter,
			};
		} catch (error) {
			throw new BadRequestException('An error occurred while retrieving Bills');
		}
	}
	async create(input: CreateBillDto): Promise<Bill> {
		try {
			if (input.user) {
				const createBill = await this.billModel.create(input);
				if (createBill) {
					return createBill;
				} else {
					throw new BadRequestException('Create Bill failed!');
				}
			}

			throw new BadRequestException('Bill has existed!');
		} catch (err) {
			return err;
		}
	}

	async addBillItem(input: UpdateBillDto): Promise<Bill> {
		try {
			console.log(input);
			const findBill = await this.billModel
				.findOne({
					_id: input.billId,
				})
				.populate('billItems');
			if (findBill && input.billItems.length > 0) {
				const billItemIds = [] as any;
				for (const val of input.billItems) {
					const createBillItem = await this.billItemService.create(val);
					if (createBillItem && createBillItem._id) {
						billItemIds.push(createBillItem._id);
					}
				}
				if (billItemIds.length > 0) {
					input.billItems = billItemIds;
					const updateBill = await this.updateOne(findBill._id, input);
					if (updateBill) {
						return updateBill;
					}
					throw new BadRequestException('Update bill not success!');
				} else {
					throw new BadRequestException('Create bill item not success!');
				}
			}

			// const creatBill = await this.
			// const findBill = await this.billModel.findOne({ user: userId });

			// const findBillPopulate = await this.billModel
			// 	.findOne({ user: userId })
			// 	.populate('billItems');
			// // input: [1,2, 3] : the most fill (follow)
			// // find Bill: [1,2,3,4,5]
			// const resultDiff = findBillPopulate.billItems.filter(
			// 	({ productSku: productSku }) =>
			// 		!input.billItems.some(
			// 			({ productSku: productSku1 }) =>
			// 				productSku1._id === productSku.toString(),
			// 		),
			// );
			// if (resultDiff) {
			// 	for (const val of resultDiff) {
			// 		await this.billItemService.deleteOne({
			// 			id: val._id,
			// 		});
			// 	}
			// }
			// // compare input and in Bill => duplication
			// const resultDup = findBillPopulate.billItems.filter(
			// 	({ productSkuId: productSkuId1 }) =>
			// 		input.billItems.some(
			// 			({ productSkuId: productSkuId }) => productSkuId === productSkuId1,
			// 		),
			// );

			// if (findBill && input.billItems) {
			// 	const BillItemNewIds = [];
			// 	for (const val of input.billItems) {
			// 		const findBillItem = await this.billItemService.findOne({
			// 			productSkuId: val.productSkuId,
			// 		});
			// 		if (!findBillItem) {
			// 			console.log('khong trung');

			// 			const name = (Math.random() + 1000000).toString(36).substring(7);
			// 			const createBillItem = await this.billItemService.create({
			// 				...val,
			// 				name: name,
			// 			});
			// 			if (createBillItem._id) {
			// 				BillItemNewIds.push(createBillItem._id.toString());
			// 			} else {
			// 				throw new BadRequestException('Create Bill item failed!');
			// 			}
			// 		} else {
			// 			console.log('trung');
			// 			await this.billItemService.updateOne(val, val.productSkuId);
			// 		}
			// 	}
			// 	if (BillItemNewIds.length > 0) {
			// 		const updateBill = await this.updateOne(findBill._id, {
			// 			grandTotal: input.grandTotal,
			// 			billItems: [...resultDup, ...BillItemNewIds],
			// 		});

			// 		if (updateBill) {
			// 			return updateBill;
			// 		} else {
			// 			for (const val of BillItemNewIds) {
			// 				await this.billItemService.deleteOne(val);
			// 			}
			// 		}
			// 	} else {
			// 		const result = resultDup.reduce((value, current) => {
			// 			return value.concat(current._id);
			// 		}, []);
			// 		console.log('resultDup', resultDup);
			// 		const updateBill = await this.updateOne(findBill._id, {
			// 			grandTotal: input.grandTotal,
			// 			billItems: result,
			// 		});
			// 		if (updateBill) {
			// 			return updateBill;
			// 		} else {
			// 			for (const val of BillItemNewIds) {
			// 				await this.billItemService.deleteOne(val);
			// 			}
			// 		}
			// 	}
			// }
			throw new BadRequestException('Bill not found');
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async updateOne(id: string, input: UpdateBillDto): Promise<Bill> {
		try {
			const bill = await this.billModel.findByIdAndUpdate(
				{
					_id: id,
				},
				input,
				{
					new: true,
				},
			);
			if (!bill) throw new NotFoundException('Product not found');
			return bill;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async deleteOne({ id }: any): Promise<SuccessResponse<Bill>> {
		try {
			if (!isValidObjectId(id)) throw new BadRequestException('ID invalid!');

			await this.billModel.findOneAndRemove({
				_id: id,
			});

			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async deleteMany(): Promise<SuccessResponse<Bill>> {
		try {
			await this.billModel.deleteMany();
			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
