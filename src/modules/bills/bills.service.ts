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
import { Bill, BillDocument, BillStatus } from './schemas/bills.schema';
import { BillItemsService } from '../bill-items/bill-items.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { PromotionsService } from '../promotions/promotions.service';
@Injectable()
export class BillsService {
	constructor(
		@InjectModel(Bill.name)
		private billModel: Model<BillDocument>,
		private readonly billItemService: BillItemsService,
		private readonly promotionService: PromotionsService,
	) {}

	async findOne(filter: Partial<Bill>): Promise<Bill> {
		try {
			return await this.billModel.findOne(filter).populate([
				'user',
				{
					path: 'billItems',
					populate: {
						path: 'productSkuId',
						populate: [
							{ path: 'optionValues', populate: 'optionSku' },
							{ path: 'reviews', populate: ['bill', 'user'] },
						],
					}, // Populate the 'user' field in each comment
				},
			]);
		} catch (error) {
			throw new BadRequestException('An error occurred while retrieving Bills');
		}
	}

	async findAll(filter: ListOptions<Bill>): Promise<ListResponse<Bill>> {
		try {
			const rgx = (pattern) => new RegExp(`.*${pattern}.*`);

			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.billModel
				.find(filter.search ? { ...filter, name: rgx(filter.search) } : filter)
				.sort(sortQuery)
				.skip(offset)
				.limit(limit)
				.populate([
					'user',
					{
						path: 'billItems',
						populate: {
							path: 'productSkuId',
							populate: [
								{ path: 'optionValues', populate: 'optionSku' },
								{ path: 'reviews', populate: ['bill', 'user'] },
							],
						}, // Populate the 'user' field in each comment
					},
				]);

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
					} else {
						await this.delete(input.billId);
					}
				}
				if (billItemIds.length > 0) {
					input.billItems = billItemIds;

					const updateBill = await this.updateOne(findBill._id, input);
					// cap nhat so luong phieu giam gia
					if (updateBill) {
						if (input.promotion && input.promotion.quantity > 0) {
							await this.promotionService.updateOne(
								{
									quantity: input.promotion.quantity - 1,
								},
								input.promotion._id,
							);
						}
						return updateBill;
					}
					throw new BadRequestException('Update bill not success!');
				} else {
					throw new BadRequestException('Create bill item not success!');
				}
			}

			throw new BadRequestException('Bill not found');
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async updateRequestCancel(id: string, input: UpdateBillDto): Promise<Bill> {
		try {
			const findBill = await this.billModel.findOne({
				_id: id,
			});
			if (findBill) {
				if (findBill.status === BillStatus.Waiting) {
					const bill = await this.billModel.findByIdAndUpdate(
						{
							_id: id,
						},
						{
							requestCancel: input.requestCancel,
						},
						{
							new: true,
						},
					);
					if (!bill) throw new NotFoundException('Update bill failed!');
					return bill;
				} else {
					throw new NotFoundException('Bill Status not in Waiting');
				}
			}
			throw new BadRequestException('Bill not found!');
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async updateStatus(id: string, input: UpdateBillDto): Promise<Bill> {
		try {
			const findBill = await this.billModel.findOne({
				_id: id,
			});
			if (findBill) {
				const bill = await this.billModel.findByIdAndUpdate(
					{
						_id: id,
					},
					{
						status: input.status,
					},
					{
						new: true,
					},
				);
				if (!bill) throw new NotFoundException('Update bill failed!');
				return bill;
			}
			throw new BadRequestException('Bill not found!');
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

	async delete(id: string): Promise<Bill> {
		const deletedReview = await this.billModel.findOneAndDelete({ _id: id });
		return deletedReview;
	}

	async deleteMany(): Promise<SuccessResponse<Bill>> {
		try {
			await this.billModel.deleteMany();
			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async getQuantityBillsStats(): Promise<object> {
		const numBills = await this.billModel.find().count();
		return { numBills };
	}

	async getWeeklyBillStats(
		month: number,
		year: number,
		week: number,
	): Promise<Array<object>> {
		console.log(year, month, week);

		const getFirstDayOfMonth = (year, month) => {
			return new Date(year, month - 1, 1); // Adjusted to get the first day of the specified month
		};

		const firstDayOfMonth = getFirstDayOfMonth(year, month);
		const startDate = new Date(firstDayOfMonth);
		startDate.setDate(startDate.getDate() + (week - 1) * 7); // Adjusted to get the start date of the specified week

		const endDate = new Date(startDate);
		endDate.setDate(endDate.getDate() + 6); // Adjusted to get the end date of the specified week

		const stats = await this.billModel.aggregate([
			{
				$match: {
					createdAt: {
						$gte: startDate,
						$lte: endDate,
					},
				},
			},
			{
				$group: {
					_id: {
						dayOfWeek: { $dayOfWeek: '$createdAt' },
					},
					numBills: { $sum: 1 },
					grandTotal: { $sum: '$grandTotal' },
					avgGrandTotal: { $avg: '$grandTotal' },
					minPrice: { $min: '$grandTotal' },
					maxPrice: { $max: '$grandTotal' },
				},
			},
			{
				$addFields: {
					weekDayName: {
						$let: {
							vars: {
								daysOfWeek: [
									'',
									'Sunday',
									'Monday',
									'Tuesday',
									'Wednesday',
									'Thursday',
									'Friday',
									'Saturday',
								],
							},
							in: {
								$arrayElemAt: ['$$daysOfWeek', '$_id.dayOfWeek'],
							},
						},
					},
				},
			},
			{
				$project: {
					_id: 0,
				},
			},
			{
				$sort: { '_id.dayOfWeek': 1 },
			},
		]);

		console.log(stats);

		return stats;
	}

	async getMonthlyBillStats(year: number): Promise<Array<object>> {
		const stats = await this.billModel.aggregate([
			{
				$match: {
					createdAt: {
						$gte: new Date(`${year}-01-01T00:00:00.000Z`),
						$lte: new Date(`${year}-12-31T00:00:00.000Z`),
					},
				},
			},
			{
				$group: {
					_id: { $month: '$createdAt' },
					numBills: { $sum: 1 },
					grandTotal: { $sum: '$grandTotal' },
					avgGrandTotal: { $avg: '$grandTotal' },
					minPrice: { $min: '$grandTotal' },
					maxPrice: { $max: '$grandTotal' },
				},
			},
			{
				$addFields: { month: '$_id' },
			},
			{
				$project: {
					_id: 0,
				},
			},
			{
				$sort: { month: -1 },
			},
		]);

		return stats;
	}

	// async getYearlyBillStats(): Promise<Array<object>> {
	// 	const stats = await this.billModel.aggregate([
	// 		{
	// 			$group: {
	// 				_id: { $year: '$createdAt' },
	// 				numBills: { $sum: 1 },
	// 				grandTotal: { $sum: '$grandTotal' },
	// 				avgGrandTotal: { $avg: '$grandTotal' },
	// 				minPrice: { $min: '$grandTotal' },
	// 				maxPrice: { $max: '$grandTotal' },
	// 			},
	// 		},
	// 		{
	// 			$addFields: { year: '$_id' },
	// 		},
	// 		{
	// 			$project: {
	// 				_id: 0,
	// 			},
	// 		},
	// 		{
	// 			$sort: { year: -1 },
	// 		},
	// 	]);

	// 	return stats;
	// }

	// Dữ liệu này có thể chứa thông tin như ngày tạo hóa đơn, tổng doanh số, sản phẩm bán được, v.v.
	async getSalesPerformance(year: number): Promise<number> {
		// Lấy doanh số bán hàng cho năm hiện tại
		const currentYearSales = await this.getYearlySales(year);

		// Lấy doanh số bán hàng cho năm trước
		const previousYearSales = await this.getYearlySales(year - 1);

		// Tính phần trăm thay đổi
		const percentageChange = this.calculatePercentageChange(
			currentYearSales,
			previousYearSales,
		);

		return percentageChange;
	}

	private async getYearlySales(year: number): Promise<number> {
		const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
		const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

		const sales = await this.billModel
			.find({
				createdAt: {
					$gte: startDate,
					$lte: endDate,
				},
			})
			.exec();

		// Tính tổng doanh số bán hàng
		const totalSales = sales.reduce(
			(total, order) => total + order.grandTotal,
			0,
		);

		return totalSales;
	}

	private calculatePercentageChange(
		currentYear: number,
		previousYear: number,
	): number {
		if (previousYear === 0) {
			return 100; // Nếu năm trước không có doanh số, hiệu suất là 100%
		}

		const percentageChange =
			((currentYear - previousYear) / previousYear) * 100;

		return percentageChange;
	}

	// doanh thu so với tháng trước
	async getSalesPerformancePercentage(
		currentMonth: number,
		currentYear: number,
	): Promise<number> {
		try {
			// Lấy tổng doanh số của tháng hiện tại
			const currentMonthSales = await this.billModel.aggregate([
				{
					$match: {
						month: currentMonth,
						year: currentYear,
					},
				},
				{
					$group: {
						_id: null,
						totalSales: { $sum: '$amount' },
					},
				},
			]);

			const currentMonthTotalSales =
				currentMonthSales.length > 0 ? currentMonthSales[0].totalSales : 0;

			// Lấy tổng doanh số của tháng trước
			const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
			const lastMonthSales = await this.billModel.aggregate([
				{
					$match: {
						month: lastMonth,
						year: currentMonth === 1 ? currentYear - 1 : currentYear,
					},
				},
				{
					$group: {
						_id: null,
						totalSales: { $sum: '$amount' },
					},
				},
			]);

			const lastMonthTotalSales =
				lastMonthSales.length > 0 ? lastMonthSales[0].totalSales : 0;

			// Tính phần trăm hiệu suất bán hàng
			if (lastMonthTotalSales === 0) {
				return 0; // Tránh chia cho 0
			}

			const performancePercentage =
				((currentMonthTotalSales - lastMonthTotalSales) / lastMonthTotalSales) *
				100;

			return performancePercentage;
		} catch (error) {
			console.error('Error calculating sales performance:', error);
			throw error;
		}
	}

	async getTopCustomerOfMonth(month: number, year: number): Promise<any> {
		try {
			const result = await this.billModel.aggregate([
				{
					$match: {
						createdAt: {
							$gte: new Date(`${year}-${month}-01T00:00:00.000Z`),
							$lte: new Date(`${year}-${month + 1}-01T00:00:00.000Z`),
						},
					},
				},
				{
					$group: {
						_id: '$user',
						totalAmount: { $sum: '$grandTotal' },
					},
				},
				{
					$sort: { totalAmount: -1 },
				},
				{
					$limit: 1,
				},
				{
					$lookup: {
						from: 'users', // Assuming the user model is stored in a collection named 'users'
						localField: '_id',
						foreignField: '_id',
						as: 'customerInfo',
					},
				},
				{
					$unwind: '$customerInfo',
				},
				{
					$project: {
						_id: 0,
						userId: '$customerInfo._id',
						username: '$customerInfo.username',
						totalAmount: 1,
					},
				},
			]);

			return result[0]; // Return the top customer of the month
		} catch (error) {
			console.error('Error retrieving top customer:', error);
			throw error;
		}
	}
}
