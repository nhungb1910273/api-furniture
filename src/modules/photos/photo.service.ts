import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { appConfig } from 'src/app.config';
import { Photo, PhotoDocument } from './schemas/photo.schema';
import { CreatePhotoDto } from './dto/create-photo-dto';
import { GenFileName } from 'src/shared/utils/gen-filename';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { Model, isValidObjectId } from 'mongoose';
import { ESortOrder } from 'src/shared/enum/sort.enum';

@Injectable()
export class PhotoService {
	// @Inject('PhotoRepository')
	// private readonly photoRepository: PhotoRepository,
	constructor(
		@InjectModel(Photo.name) private photoModel: Model<PhotoDocument>,
	) {}

	async findOne(filter: Partial<Photo>): Promise<Photo> {
		return this.photoModel.findOne(filter);
	}

	async findAll(filter: ListOptions<Photo>): Promise<ListResponse<Photo>> {
		try {
			const sortQuery = {};
			sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.photoModel
				.find(filter)
				.sort(sortQuery)
				.skip(offset)
				.limit(limit);

			return {
				items: result,
				total: result?.length,
				options: filter,
			};
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Options',
			);
		}
	}
	async uploadOneFile(file: Express.Multer.File, ownerID: any): Promise<Photo> {
		const allowedMimeTypes = ['image/jpeg', 'image/png'];

		if (isValidObjectId(ownerID) && file) {
			if (allowedMimeTypes.includes(file.mimetype)) {
				const dir = `${appConfig.fileRoot}/${ownerID}`;
				if (!existsSync(dir)) {
					mkdirSync(dir, { recursive: true });
				}
				const fileName = GenFileName.gen(file.mimetype);
				try {
					writeFileSync(`${dir}/${fileName}`, file.buffer);
					const input: CreatePhotoDto = {
						ownerID: ownerID,
						name: fileName,
					};
					return this.photoModel.create(input);
				} catch (error) {
					throw new BadRequestException('Upload photo failed');
				}
			} else {
				throw new BadRequestException('Invalid file type');
			}
		}
		return null;
	}

	async uploadManyFile(
		files: {
			photos?: Express.Multer.File[];
			photoUpdates?: Express.Multer.File[];
		},
		ownerID: any,
	): Promise<ListResponse<Photo>> {
		console.log('photoUpdates upload', files);
		let data: Photo[] = [];
		if (
			isValidObjectId(ownerID) &&
			files &&
			(files.photos || files.photoUpdates)
		) {
			const uploadPromises: Promise<Photo>[] = [];
			try {
				if (files.photoUpdates) {
					for (const img of files.photoUpdates) {
						const uploadPromise = this.uploadOneFile(img, ownerID);
						uploadPromises.push(uploadPromise);
					}
					data = await Promise.all(uploadPromises);
				} else {
					for (const img of files.photos) {
						const uploadPromise = this.uploadOneFile(img, ownerID);
						uploadPromises.push(uploadPromise);
					}
					data = await Promise.all(uploadPromises);
				}
			} catch (error) {
				throw new BadRequestException('Upload photo failed');
			}
			return {
				items: data,
				total: data.length,
				options: {},
			};
		} else {
			throw new BadRequestException('Photo not found');
		}
	}

	async findMany(filter: ListOptions<Photo>): Promise<ListResponse<Photo>> {
		try {
			const sortQuery = {};
			if (filter.sortBy) {
				sortQuery[filter.sortBy] = filter.sortOrder === 'asc' ? 1 : -1;
			}
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.photoModel
				.find(filter)
				.sort(sortQuery)
				.skip(offset)
				.limit(limit);
			return {
				items: result,
				total: result?.length,
				options: filter,
			};
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving photos',
			);
		}
	}

	async findOneByID(id: string): Promise<Photo> {
		return await this.photoModel.findById(id);
	}

	async delete(id: string): Promise<Photo> {
		const photo = await this.photoModel.findOneAndDelete({ _id: id });
		return photo;
	}
}
