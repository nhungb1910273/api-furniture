import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { SuccessResponse } from 'src/shared/response/success-response';
import { PhotoService } from '../photos/photo.service';
import { CreateRoomFurnitureDto } from './dto/create-room-furniture.dto';
import { UpdateRoomFurnitureDto } from './dto/update-room-furniture.dto';
import {
	RoomFurniture,
	RoomFurnitureDocument,
} from './schemas/room-furnitures.schema';
@Injectable()
export class RoomFurnituresService {
	constructor(
		@InjectModel(RoomFurniture.name)
		private roomFurnitureModel: Model<RoomFurnitureDocument>,
		private readonly photoService: PhotoService,
	) {}

	async findOne(filter: Partial<RoomFurniture>): Promise<RoomFurniture> {
		return this.roomFurnitureModel.findOne(filter).populate('categories');
	}

	async findAll(
		filter: ListOptions<RoomFurniture>,
	): Promise<ListResponse<RoomFurniture>> {
		try {
			const rgx = (pattern) => new RegExp(`.*${pattern}.*`);

			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;

			const result = await this.roomFurnitureModel
				.find(filter.search ? { ...filter, name: rgx(filter.search) } : filter)
				.sort(sortQuery)
				.skip(offset)
				.limit(limit)
				.populate('categories');
			return {
				items: result,
				total: result?.length,
				options: filter,
			};
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving room furnitures',
			);
		}
	}
	async createRoomFurniture(
		input: CreateRoomFurnitureDto,
		photo: Express.Multer.File,
	): Promise<RoomFurniture> {
		try {
			const roomFurniture = await this.roomFurnitureModel.findOne({
				name: input.name,
			});
			if (!roomFurniture) {
				const createRoomFurniture = await this.roomFurnitureModel.create(input);
				if (photo) {
					const createPhoto = await this.photoService.uploadOneFile(
						photo,
						createRoomFurniture._id,
					);
					createRoomFurniture.photo = createPhoto;
				}
				console.log(createRoomFurniture);
				return await createRoomFurniture.save();
			}
			throw new BadRequestException('Room furniture has existed!');
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	// async createOne(input: CreateRoomFurnitureDto): Promise<RoomFurniture> {
	// 	try {
	// 		const user = await this.roomFurnitureModel.findOne({
	// 			name: input.name,
	// 			description: input.description,
	// 		});
	// 		if (!user) {
	// 			return this.roomFurnitureModel.create(input);
	// 		}
	// 		throw new BadRequestException('Email has existed!');
	// 	} catch (err) {
	// 		return err;
	// 	}
	// }

	async updateOne(
		input: UpdateRoomFurnitureDto,
		id: string,
		photo?: Express.Multer.File,
	): Promise<RoomFurniture> {
		try {
			console.log('UPDATED');
			const roomFurniture = await this.roomFurnitureModel.findByIdAndUpdate(
				id,
				input,
				{
					new: true,
				},
			);
			if (!roomFurniture) throw new NotFoundException('Product not found');
			// console.log(roomFurniture);
			// for (const val of input.photos) {
			// 	const res = roomFurniture.photos.find((el) => el._id !== val._id);
			// 	console.log(res);
			// }
			if (photo) {
				console.log('photo has exited');
				await this.photoService.delete(roomFurniture.photo._id);
				const createPhoto = await this.photoService.uploadOneFile(
					photo,
					roomFurniture._id,
				);
				roomFurniture.photo = createPhoto;
				await roomFurniture.save();
			}
			return roomFurniture;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	// async updateMany(
	// 	filter: Partial<RoomFurniture>,
	// 	input: UpdateRoomFurnitureDto[],
	// ): Promise<RoomFurniture> {
	// 	try {
	// 		return await this.updateMany(filter, input);
	// 	} catch (err) {}
	// }

	async deleteOne(id: string): Promise<SuccessResponse<RoomFurniture>> {
		try {
			const roomFurniture = await this.roomFurnitureModel.findByIdAndDelete(id);
			if (!roomFurniture) {
				throw new NotFoundException('roomFurniture not found');
			}
			return;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
