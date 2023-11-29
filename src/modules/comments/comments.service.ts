import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {
	Comment,
	CommentDocument,
	CommentStatus,
} from './schemas/comments.schemas';
@Injectable()
export class CommentsService {
	constructor(
		@InjectModel(Comment.name)
		private commentModel: Model<CommentDocument>,
	) {}

	async findOne(filter: Partial<Comment>): Promise<Comment> {
		try {
			return await this.commentModel.findOne(filter).populate(['blog', 'user']);
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Comments',
			);
		}
	}

	async findAll(filter: ListOptions<Comment>): Promise<ListResponse<Comment>> {
		try {
			const rgx = (pattern) => new RegExp(`.*${pattern}.*`);

			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.commentModel
				.find(filter.search ? { ...filter, name: rgx(filter.search) } : filter)
				.sort(sortQuery)
				.skip(offset)
				.limit(limit)
				.populate(['user', 'blog']);

			return {
				items: result,
				total: result?.length,
				options: filter,
			};
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Comments',
			);
		}
	}
	async create(input: CreateCommentDto): Promise<Comment> {
		try {
			return await this.commentModel.create(input);
		} catch (err) {
			return err;
		}
	}

	// async createOne(input: CreateCommentDto): Promise<Comment> {
	// 	try {
	// 		const user = await this.commentModel.findOne({
	// 			name: input.name,
	// 			description: input.description,
	// 		});
	// 		if (!user) {
	// 			return this.commentModel.create(input);
	// 		}
	// 		throw new BadRequestException('Email has existed!');
	// 	} catch (err) {
	// 		return err;
	// 	}
	// }

	async updateStatus(input: UpdateCommentDto, id: string): Promise<Comment> {
		try {
			if (input.comment) {
				return await this.commentModel.findByIdAndUpdate(
					{
						_id: id,
					},
					{
						status: CommentStatus.Approved,
					},
					{
						new: true,
					},
				);
			}
			throw new BadRequestException('Data invalid!');
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	// async deleteOne({ id }: any): Promise<SuccessResponse<Comment>> {
	// 	try {
	// 		if (!isValidObjectId(id)) throw new BadRequestException('ID invalid!');

	// 		await this.commentModel.findOneAndRemove({
	// 			_id: id,
	// 		});

	// 		return;
	// 	} catch (err) {
	// 		throw new BadRequestException(err);
	// 	}
	// }

	async delete(id: string): Promise<Comment> {
		const deletedComment = await this.commentModel.findOneAndDelete({
			_id: id,
		});

		return deletedComment;
	}

	async calculateAverageRating(product: string): Promise<number> {
		try {
			const objectId = new Types.ObjectId(product);

			const aggregateResult = await this.commentModel.aggregate([
				{ $match: { product: objectId } },
				{ $group: { _id: null, averageStar: { $avg: '$rating' } } },
			]);

			const averageStar =
				aggregateResult.length > 0 ? aggregateResult[0].averageStar : undefined;

			return parseFloat(averageStar.toFixed(2));
		} catch (error) {
			return undefined;
		}
	}
}
