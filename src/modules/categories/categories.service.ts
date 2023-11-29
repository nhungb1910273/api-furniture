import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, isValidObjectId } from 'mongoose';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { SuccessResponse } from 'src/shared/response/success-response';
import { PhotoService } from '../photos/photo.service';
import { RoomFurnituresService } from '../room-furnitures/room-furnitures.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/categories.schema';
@Injectable()
export class CategoriesService {
	constructor(
		@InjectModel(Category.name)
		private categoryModel: Model<CategoryDocument>,
		private readonly roomFurnitureService: RoomFurnituresService,
		private readonly photoService: PhotoService,
	) {}

	async findOne(filter: Partial<Category>): Promise<Category> {
		try {
			return await this.categoryModel
				.findOne(filter)
				.populate('roomFurnitures');
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Categorys',
			);
		}
	}

	async findOneById(filter: ListOptions<Category>): Promise<Category> {
		try {
			const objectID = new mongoose.Types.ObjectId(filter._id);
			const category = await this.categoryModel.aggregate([
				{ $match: { _id: objectID } },
				{
					$lookup: {
						from: 'roomfurnitures',
						localField: 'roomFurnitureIds',
						foreignField: '_id',
						as: 'roomFurnitureIds',
					},
				},
			]);
			return category[0];
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Categorys',
			);
		}
	}

	async findAll(
		filter: ListOptions<Category>,
	): Promise<ListResponse<Category>> {
		try {
			const rgx = (pattern) => new RegExp(`.*${pattern}.*`);

			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.categoryModel
				.find(filter.search ? { ...filter, name: rgx(filter.search) } : filter)
				.sort(sortQuery)
				.skip(offset)
				.limit(limit)
				.populate('roomFurnitures');

			return {
				items: result,
				total: result?.length,
				options: filter,
			};
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Categorys',
			);
		}
	}

	async createCategory(
		input: CreateCategoryDto,
		photo?: Express.Multer.File,
	): Promise<Category> {
		try {
			const findCategory = await this.categoryModel.findOne({
				name: input.name,
			});
			if (!findCategory) {
				const roomFurnitureIds = [];
				if (input.roomFurnitures?.length) {
					for (const roomFurnitureId of input.roomFurnitures) {
						const findRoomFurniture = await this.roomFurnitureService.findOne({
							_id: roomFurnitureId,
						});
						if (!findRoomFurniture) {
							throw new BadRequestException('Room Furniture not found');
						}
						// const objectID = new mongoose.Types.ObjectId(roomFurnitureId);
						roomFurnitureIds.push(findRoomFurniture._id);
					}
				}
				input.roomFurnitures = roomFurnitureIds;

				const createCategory = await this.categoryModel.create(input);

				if (photo) {
					const createPhoto = await this.photoService.uploadOneFile(
						photo,
						createCategory._id,
					);
					createCategory.photo = createPhoto;
					await createCategory.save();
				}
				return createCategory;
			}
			throw new BadRequestException('Category has existed!');
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async updateOne(
		input: UpdateCategoryDto,
		id: string,
		photo?: Express.Multer.File,
	): Promise<Category> {
		try {
			const findCat = await this.categoryModel.findOne({
				_id: id,
			});
			if (!input.name) {
				input.name = findCat.name;
			}
			if (!input.description) {
				input.description = findCat.description;
			}
			if (!photo) {
				input.photo = findCat.photo;
			}
			if (input.name || input.description || input.photo) {
				const cat = await this.categoryModel.findByIdAndUpdate(
					findCat._id,
					input,
					{
						new: true,
					},
				);
				if (!cat) throw new NotFoundException('Product not found');
				if (photo) {
					console.log('photo has exited');
					await this.photoService.delete(cat.photo._id);
					const createPhoto = await this.photoService.uploadOneFile(
						photo,
						cat._id,
					);
					cat.photo = createPhoto;
					await cat.save();
				}
				return cat;
			}
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async deleteOne({ id }: any): Promise<SuccessResponse<Category>> {
		try {
			if (!isValidObjectId(id)) throw new BadRequestException('ID invalid!');
			const cat = await this.categoryModel.findByIdAndDelete(id);
			await this.photoService.delete(cat.photo._id);
			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
