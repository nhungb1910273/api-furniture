import { Model } from 'mongoose';
import { PhotoService } from '../photo.service';
import { Photo } from '../schemas/photo.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { GenFileName } from 'src/shared/utils/gen-filename';
import { BadRequestException } from '@nestjs/common';
import { ListOptions } from 'src/shared/response/common-response';
import * as fs from 'fs';
import { PhotoStub } from './stubs/photo.stubs';

jest.mock('fs');

describe('PhotoService', function () {
	let photoService: PhotoService;
	let photoModel: Model<Photo>;

	const mockModel = {
		create: jest.fn().mockReturnValue(PhotoStub),
		find: jest.fn(),
		findById: jest.fn(),
		findOneAndDelete: jest.fn(),
	};

	const writeFileSyncMock = jest.fn();
	jest.spyOn(fs, 'writeFileSync').mockImplementation(writeFileSyncMock);
	jest.spyOn(GenFileName, 'gen').mockReturnValue('mocked-file-name.jpg');

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PhotoService,
				{
					provide: getModelToken(Photo.name),
					useValue: mockModel,
				},
			],
		}).compile();

		photoService = module.get<PhotoService>(PhotoService);
		photoModel = module.get<Model<Photo>>(getModelToken(Photo.name));
	});

	it('should be defined', () => {
		expect(photoService).toBeDefined();
	});
	it('photoModel should be defined', () => {
		expect(photoModel).toBeDefined();
	});

	describe('uploadOneFile', () => {
		it('should upload one file and create a photo record in Photo collection', async () => {
			const ownerID = '649d3f7372e91c40d2e7e9dc';
			const file = {
				fieldname: 'fieldname',
				originalname: 'example.jpg',
				encoding: '7bit',
				mimetype: 'image/jpeg',
				size: 12345,
				buffer: Buffer.from('example image buffer'),
				stream: null,
				destination: 'path/to/destination',
				filename: 'example.jpg',
				path: '/path/to/file.jpg',
			};

			const createSpy = jest.spyOn(mockModel, 'create');
			const result = await photoService.uploadOneFile(file, ownerID);

			expect(createSpy).toHaveBeenCalledWith({
				ownerID: ownerID,
				name: expect.any(String),
			});
			expect(result).toEqual(PhotoStub);
		});

		it('should not upload if ownerID is not valid', async () => {
			const ownerID = '123';
			const file = {
				fieldname: 'fieldname',
				originalname: 'example.jpg',
				encoding: '7bit',
				mimetype: 'image/jpeg',
				size: 12345,
				buffer: Buffer.from('example image buffer'),
				stream: null,
				destination: 'path/to/destination',
				filename: 'example.jpg',
				path: '/path/to/file.jpg',
			};
			mockModel.create.mockClear();
			const createSpy = jest.spyOn(photoModel, 'create');
			const result = await photoService.uploadOneFile(file, ownerID);

			expect(createSpy).not.toHaveBeenCalled();
			expect(result).toBeNull();
		});

		it('should not upload a file with a non-allowed file type', async () => {
			const ownerID = '649d3f7372e91c40d2e7e9dc';

			const file: Express.Multer.File = {
				fieldname: 'fieldname',
				originalname: 'example.txt',
				encoding: '7bit',
				mimetype: 'text/plain',
				size: 12345,
				buffer: Buffer.from('example file buffer'),
				stream: null,
				destination: 'path/to/destination',
				filename: 'example.txt',
				path: '/path/to/file.txt',
			};

			await expect(photoService.uploadOneFile(file, ownerID)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should handle file write failure', async () => {
			const ownerID = '649d3f7372e91c40d2e7e9dc';
			const file = {
				fieldname: 'fieldname',
				originalname: 'example.jpg',
				encoding: '7bit',
				mimetype: 'image/jpeg',
				size: 12345,
				buffer: Buffer.from('example image buffer'),
				stream: null,
				destination: 'path/to/destination',
				filename: 'example.jpg',
				path: '/path/to/file.jpg',
			};

			jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
				throw new Error('File write failure');
			});

			await expect(photoService.uploadOneFile(file, ownerID)).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe('uploadManyFile', () => {
		it('should return an empty ListResponse if ownerID is not valid', async () => {
			const ownerID = '123';
			const files = {
				photos: [
					{
						fieldname: 'fieldname',
						originalname: 'example.jpg',
						encoding: '7bit',
						mimetype: 'image/jpeg',
						size: 12345,
						buffer: Buffer.from('example image buffer'),
						stream: null, // Set the appropriate value for the stream property
						destination: 'path/to/destination', // Set the appropriate value for the destination property
						filename: 'example.jpg', // Set the appropriate value for the filename property
						path: '/path/to/file.jpg', // Set the appropriate value for the path property
					},
				],
			};

			jest
				.spyOn(photoService, 'uploadOneFile')
				.mockResolvedValueOnce(PhotoStub());
			const result = await photoService.uploadManyFile(files, ownerID);

			expect(result).toEqual({
				items: [],
				total: 0,
				options: {},
			});
		});

		it('should return an empty ListResponse when no files are provided', async () => {
			// Arrange
			const ownerID = '649d3f7372e91c40d2e7e9dc';
			const files = {};

			// Act
			const result = await photoService.uploadManyFile(files, ownerID);

			// Assert
			expect(result).toEqual({
				items: [],
				total: 0,
				options: {},
			});
		});

		it('should return a ListResponse with uploaded photos when files are provided', async () => {
			// Arrange
			const ownerID = '649d3f7372e91c40d2e7e9dc';
			const files = {
				photos: [
					{
						fieldname: 'fieldname',
						originalname: 'example.jpg',
						encoding: '7bit',
						mimetype: 'image/jpeg',
						size: 12345,
						buffer: Buffer.from('example image buffer'),
						stream: null, // Set the appropriate value for the stream property
						destination: 'path/to/destination', // Set the appropriate value for the destination property
						filename: 'example.jpg', // Set the appropriate value for the filename property
						path: '/path/to/file.jpg', // Set the appropriate value for the path property
					},
				],
			};

			const uploadOneFileMock = jest
				.spyOn(photoService, 'uploadOneFile')
				.mockResolvedValueOnce(PhotoStub());

			const result = await photoService.uploadManyFile(files, ownerID);

			expect(uploadOneFileMock).toHaveBeenCalledTimes(1);
			expect(uploadOneFileMock).toHaveBeenCalledWith(ownerID, files.photos[0]);
			expect(result).toEqual({
				items: [PhotoStub()],
				total: 1,
				options: {},
			});
		});

		it('should throw BadRequestException when file writed failure', async () => {
			// Arrange
			const ownerID = '649d3f7372e91c40d2e7e9dc';
			const files = {
				photos: [
					{
						fieldname: 'fieldname',
						originalname: 'example.jpg',
						encoding: '7bit',
						mimetype: 'image/jpeg',
						size: 12345,
						buffer: Buffer.from('example image buffer'),
						stream: null, // Set the appropriate value for the stream property
						destination: 'path/to/destination', // Set the appropriate value for the destination property
						filename: 'example.jpg', // Set the appropriate value for the filename property
						path: '/path/to/file.jpg', // Set the appropriate value for the path property
					},
				],
			};

			jest.spyOn(photoService, 'uploadOneFile').mockImplementation(() => {
				throw new Error('File write failure');
			});

			await expect(photoService.uploadManyFile(files, ownerID)).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe('findMany', () => {
		it('should return a list of photos based on the provided filter', async () => {
			const filter: ListOptions<Photo> = {
				sortBy: 'createdAt',
				sortOrder: 'desc',
				limit: 10,
				offset: 0,
			};

			const mockResult = [PhotoStub(), PhotoStub(), PhotoStub()];
			jest.spyOn(mockModel, 'find').mockReturnValueOnce({
				sort: jest.fn().mockReturnThis(),
				skip: jest.fn().mockReturnThis(),
				limit: jest.fn().mockResolvedValueOnce(mockResult),
			} as any);

			const result = await photoService.findMany(filter);

			expect(photoModel.find).toHaveBeenCalledWith(filter);
			expect(result.items).toEqual(mockResult);
			expect(result.total).toBe(mockResult.length);
			expect(result.options).toEqual(filter);
		});

		it('should return an empty list when no photos match the filter', async () => {
			// Arrange
			const filter: ListOptions<Photo> = {
				sortBy: 'createdAt',
				sortOrder: 'asc',
				limit: 10,
				offset: 0,
			};

			jest.spyOn(mockModel, 'find').mockImplementation(() => ({
				sort: () => ({
					skip: () => ({
						limit: jest.fn().mockResolvedValue([]),
					}),
				}),
			}));

			const result = await photoService.findMany(filter);

			expect(photoModel.find).toHaveBeenCalledWith(filter);
			expect(result.items).toEqual([]);
			expect(result.total).toBe(0);
			expect(result.options).toEqual(filter);
		});

		it('should handle errors and throw BadRequestException', async () => {
			const filter: ListOptions<Photo> = {
				sortBy: 'createdAt',
				sortOrder: 'desc',
				limit: 10,
				offset: 0,
			};

			jest.spyOn(mockModel, 'find').mockImplementation(() => {
				throw new Error('An error occurred while retrieving photos');
			});

			await expect(photoService.findMany(filter)).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe('findOneByID', () => {
		it('should find a photo by ID', async () => {
			const photoID = '123456789';

			const findByIdSpy = jest
				.spyOn(mockModel, 'findById')
				.mockReturnValueOnce(PhotoStub());

			const result = await photoService.findOneByID(photoID);

			expect(findByIdSpy).toHaveBeenCalledWith(photoID);
			expect(result).toEqual(PhotoStub());
		});
	});

	describe('delete', () => {
		it('should delete a photo by ID', async () => {
			const photoID = '649d347672e91c40d2e7e89c';

			const findOneAndDeleteSpy = jest
				.spyOn(mockModel, 'findOneAndDelete')
				.mockReturnValue(PhotoStub());

			const result = await photoService.delete(photoID);
			expect(findOneAndDeleteSpy).toHaveBeenCalledWith({ _id: photoID });
			expect(result).toEqual(PhotoStub());
		});
	});
});
