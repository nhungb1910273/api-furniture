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
import { CategoriesService } from '../categories/categories.service';
import { CommentsService } from '../comments/comments.service';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { CommentStatus } from '../comments/schemas/comments.schemas';
import { PhotoService } from '../photos/photo.service';
import { RoomFurnituresService } from '../room-furnitures/room-furnitures.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog, BlogDocument } from './schemas/blogs.schema';
@Injectable()
export class BlogsService {
	constructor(
		@InjectModel(Blog.name)
		private blogModel: Model<BlogDocument>,
		private readonly photoService: PhotoService,
		private readonly categoryService: CategoriesService,
		private readonly roomFurnitureService: RoomFurnituresService,
		private readonly commentService: CommentsService,
	) {}

	async findOne(filter: Partial<Blog>): Promise<Blog> {
		try {
			return await this.blogModel.findOne(filter).populate([
				'category',
				'roomFurniture',
				{
					path: 'comments',
					match: { status: CommentStatus.Approved }, // Filter comments with status 'Approvedd'
					populate: { path: 'user' }, // Populate the 'user' field in each comment
				},
			]);
		} catch (error) {
			throw new BadRequestException('An error occurred while retrieving Blogs');
		}
	}

	async findAll(filter: ListOptions<Blog>): Promise<ListResponse<Blog>> {
		try {
			const rgx = (pattern) => new RegExp(`.*${pattern}.*`);

			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.blogModel
				.find(filter.search ? { ...filter, name: rgx(filter.search) } : filter)
				.sort(sortQuery)
				.skip(offset)
				.limit(limit)
				.populate(['category', 'roomFurniture']);

			return {
				items: result,
				total: result?.length,
				options: filter,
			};
		} catch (error) {
			throw new BadRequestException('An error occurred while retrieving blogs');
		}
	}

	async create(
		input: CreateBlogDto,
		files?: { photos?: Express.Multer.File[] },
	): Promise<Blog> {
		try {
			// console.log(input, files);
			const blog = await this.blogModel.findOne({
				name: input.name,
			});
			if (!blog) {
				const findCat = await this.categoryService.findOne({
					_id: input.category,
				});
				const findRoom = await this.roomFurnitureService.findOne({
					_id: input.roomFurniture,
				});
				if (findCat && findRoom) {
					const arr = findCat.roomFurnitures.filter(
						(item) => item._id !== findRoom._id,
					);
					if (arr) {
						input.category = findCat._id;
						input.roomFurniture = findRoom._id;
						const createBlog = await this.blogModel.create(input);

						if (files.photos && files) {
							const createPhotos = await this.photoService.uploadManyFile(
								files,
								createBlog._id,
							);
							if (createPhotos.total !== 0) {
								createBlog.photos = createPhotos.items;
							} else {
								await this.blogModel.findByIdAndRemove(createBlog._id);
							}
						}
						return await createBlog.save();
					} else {
						throw new BadRequestException(
							'Category has exited in Room Furniture!',
						);
					}
				}
				throw new BadRequestException('Category or Room furniture has exited!');
			}
			throw new BadRequestException('Blog has existed!');
		} catch (err) {
			return err;
		}
	}

	async updateOne(
		input: UpdateBlogDto,
		id: string,
		files?: { photoUpdates?: Express.Multer.File[] },
	): Promise<Blog> {
		try {
			// const findPhoto = await this.photoService.findAll({});
			const findPhoto = await this.blogModel.findOne({
				_id: id,
			});
			if (findPhoto && input.photos) {
				for (const val of input.photos) {
					const arr = findPhoto.photos.filter((item) => item._id !== val._id);
					if (arr.length) {
						await this.photoService.delete(val._id);
					}
				}
			}
			if (files && files.photoUpdates) {
				const createPhotos = await this.photoService.uploadManyFile(files, id);
				// console.log('createPhotos', createPhotos);
				if (createPhotos.total !== 0) {
					input.photos = [...input.photos, ...createPhotos.items];
				}
			}

			const updateBlog = await this.blogModel.findOneAndUpdate(
				{ _id: id },
				input,
				{
					new: true,
				},
			);
			if (!updateBlog) throw new NotFoundException('Product not found');
			return updateBlog;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async updateStatus(input: UpdateBlogDto, id: string): Promise<Blog> {
		try {
			const updateBlog = await this.blogModel.findOneAndUpdate(
				{ _id: id },
				{
					status: input.status,
				},
				{
					new: true,
				},
			);
			if (!updateBlog) throw new NotFoundException('Product not found');
			return updateBlog;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async deleteOne({ id }: any): Promise<SuccessResponse<Blog>> {
		try {
			if (!isValidObjectId(id)) throw new BadRequestException('ID invalid!');

			await this.blogModel.findOneAndRemove({
				_id: id,
			});
			// const findPhoto = await this.photoService.findAll()
			// await this.photoService.delete(blog.photo._id);

			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async addComment(id: string, commentDto: CreateCommentDto): Promise<Blog> {
		commentDto.blog = id;

		const createdComment = await this.commentService.create(commentDto);

		if (createdComment) {
			const findBlog = await this.blogModel.findOne({
				_id: id,
			});
			if (findBlog && findBlog.comments && findBlog.comments.length > 0) {
				return this.blogModel.findOneAndUpdate(
					{ _id: id },
					{ comments: [...findBlog.comments, createdComment] },
					{ new: true },
				);
			}
			return this.blogModel.findOneAndUpdate(
				{ _id: id },
				{
					comments: createdComment,
				},
				{ new: true },
			);
		}
		throw new BadRequestException('Create comment failed!');
	}
	async deleteMany(): Promise<SuccessResponse<Blog>> {
		try {
			await this.blogModel.deleteMany();
			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
