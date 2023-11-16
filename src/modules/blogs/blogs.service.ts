import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import { SuccessResponse } from 'src/shared/response/success-response';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { Blog, BlogDocument, BlogStatus } from './schemas/blogs.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { PhotoService } from '../photos/photo.service';
import { CategoriesService } from '../categories/categories.service';
import { RoomFurnituresService } from '../room-furnitures/room-furnitures.service';
import { UpdateBlogDto } from './dto/update-blog.dto';
@Injectable()
export class BlogsService {
	constructor(
		@InjectModel(Blog.name)
		private blogModel: Model<BlogDocument>,
		private readonly photoService: PhotoService,
		private readonly categoryService: CategoriesService,
		private readonly roomFurnitureService: RoomFurnituresService,
	) {}

	async findOne(filter: Partial<Blog>): Promise<Blog> {
		try {
			return await this.blogModel
				.findOne(filter)
				.populate(['category', 'roomFurniture']);
		} catch (error) {
			throw new BadRequestException('An error occurred while retrieving Blogs');
		}
	}

	async findAll(filter: ListOptions<Blog>): Promise<ListResponse<Blog>> {
		try {
			let input = {} as any;
			if (filter.search && filter.cat) {
				input = {
					...filter,
					$and: [
						{ category: filter.cat },
						{
							name: { $regex: filter.search, $options: 'i' },
						},
					],
				};
			} else if (filter.cat) {
				input = {
					...filter,
					category: filter.cat,
				};
			} else if (filter.search) {
				input = {
					...filter,
					name: { $regex: filter.search, $options: 'i' },
				};
			}
			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.blogModel
				.find(input)
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
					const arr = findPhoto.photos.filter((item) => item._id === val._id);
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

	async deleteMany(): Promise<SuccessResponse<Blog>> {
		try {
			await this.blogModel.deleteMany();
			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
