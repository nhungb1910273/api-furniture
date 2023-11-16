// import { HttpStatus } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { appConfig } from '../../app.config';
import { RoomFurnituresService } from './room-furnitures.service';
import {
	RoomFurniture,
	RoomFurnitureSchema,
	// RoomFurnitureStatus,
} from './schemas/room-furnitures.schema';
import { CreateRoomFurnitureDto } from './dto/create-room-furniture.dto';

describe('RoomFurnitureService', () => {
	let service: RoomFurnituresService;
	let roomFurnitureId = '';

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				MongooseModule.forRoot(appConfig.mongoURI),
				MongooseModule.forFeature([
					{ name: RoomFurniture.name, schema: RoomFurnitureSchema },
				]),
			],
			providers: [RoomFurnituresService],
		}).compile();

		service = module.get<RoomFurnituresService>(RoomFurnituresService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should be find roomFurnitures with pagination', async () => {
		const query = {
			limit: 10,
			offset: 0,
		};

		const roomFurnitures = await service.findAll(query);

		expect(roomFurnitures.items.length).toEqual(10);
	});

	it('should be find roomFurnitures with correct result', async () => {
		const query = {
			limit: 10,
			offset: 0,
			displayName: 'roomFurniture',
		};

		const roomFurnitures = await service.findAll(query);

		if (roomFurnitures.items.length > 0) {
			expect(roomFurnitures.items[0]?.name).toContain(query.displayName);
		}
		expect(roomFurnitures.items.length).toEqual(0);
	});

	it('should be create a roomFurniture', async () => {
		const input: CreateRoomFurnitureDto = {
			name: 'Test roomFurniture',
			description: 'testroomFurniture@test.com',
			photos: [
				{
					createdAt: new Date('2023-06-29T07:36:22.758Z'),
					updatedAt: new Date('2023-06-29T07:36:22.758Z'),
					name: '1688024182737-366333986.jpeg',
					imageURL:
						'https://hdfitness.vn/wp-content/uploads/2022/02/tap-gym-la-gi-5-min-scaled.jpg',
					_id: '649d347672e91c40d2e7e89c',
				},
			],
			// status: RoomFurnitureStatus.ACTIVE,
		};
		const roomFurniture = await service.create(input);

		if (roomFurniture) {
			roomFurnitureId = roomFurniture._id;
		}

		expect(roomFurniture).toBeTruthy();
		expect(roomFurniture.name).toEqual(input.name);
	});

	it('should be find a roomFurniture by id', async () => {
		const roomFurniture = await service.findOne({ _id: roomFurnitureId });

		expect(roomFurniture).toBeTruthy();
		expect(roomFurniture._id).toEqual(roomFurnitureId);
	});

	it('should be update a roomFurniture by id', async () => {
		const input: any = {
			id: roomFurnitureId,
			name: 'Updated name',
			description: 'Updated description',
		};
		const roomFurniture = await service.updateOne(input);

		expect(roomFurniture).toBeTruthy();
		expect(roomFurniture.name).toEqual(input.name);
		expect(roomFurniture.description).toEqual(input.description);
	});

	// it('should be update the roomFurniture avatar', async () => {
	// 	const url = 'uri_path';
	// 	const roomFurniture = await service.updateAvatar(roomFurnitureId, url);

	// 	expect(roomFurniture.avatar).toEqual(url);
	// });

	// it('should be delete a roomFurniture by id', async () => {
	// 	const res = await service.deleteOne(roomFurnitureId);

	// 	expect(res.statusCode).toEqual(HttpStatus.OK);
	// });

	it('should be get a null after deleted roomFurniture', async () => {
		const roomFurniture = await service.findOne({ _id: roomFurnitureId });

		expect(roomFurniture).toBeFalsy();
	});
});
