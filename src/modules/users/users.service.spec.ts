// import { HttpStatus } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Test, TestingModule } from '@nestjs/testing';
// import { appConfig } from '../../app.config';
// import { CreateUserDto } from './dto/create-user-dto';
// import { User, UserRole, UserSchema } from './schemas/user.schema';
// import { UsersService } from './users.service';

// describe('UserService', () => {
// 	let service: UsersService;
// 	let userId = '';

// 	beforeEach(async () => {
// 		const module: TestingModule = await Test.createTestingModule({
// 			imports: [
// 				MongooseModule.forRoot(appConfig.mongoURI),
// 				MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
// 			],
// 			providers: [UsersService],
// 		}).compile();

// 		service = module.get<UsersService>(UsersService);
// 	});

// 	it('should be defined', () => {
// 		expect(service).toBeDefined();
// 	});

// 	it('should be find users with pagination', async () => {
// 		const query = {
// 			limit: 10,
// 			offset: 0,
// 		};

// 		const users = await service.findAll(query);

// 		expect(users.data.length).toEqual(10);
// 	});

// 	it('should be find users with correct result', async () => {
// 		const query = {
// 			limit: 10,
// 			offset: 0,
// 			displayName: 'User',
// 		};

// 		const users = await service.findAll(query);

// 		if (users.data.length > 0) {
// 			expect(users.data[0]?.displayName).toContain(query.displayName);
// 		}
// 		expect(users.data.length).toEqual(0);
// 	});

// 	it('should be create a user', async () => {
// 		const input: CreateUserDto = {
// 			displayName: 'Test user',
// 			email: 'testuser@test.com',
// 			password: '123123123',
// 			role: UserRole.MEMBER,
// 			avatar: '',
// 		};
// 		const user = await service.createOne(input);

// 		if (user) {
// 			userId = user._id;
// 		}

// 		expect(user).toBeTruthy();
// 		expect(user.email).toEqual(input.email);
// 	});

// 	it('should be find a user by id', async () => {
// 		const user = await service.findOne({ _id: userId });

// 		expect(user).toBeTruthy();
// 		expect(user._id).toEqual(userId);
// 	});

// 	it('should be update a user by id', async () => {
// 		const input: any = {
// 			id: userId,
// 			displayName: 'Updated name',
// 		};
// 		const user = await service.updateOne(input);

// 		expect(user).toBeTruthy();
// 		expect(user.displayName).toEqual(input.displayName);
// 	});

// 	it('should be update the user avatar', async () => {
// 		const url = 'uri_path';
// 		const user = await service.updateAvatar(userId, url);

// 		expect(user.avatar).toEqual(url);
// 	});

// 	it('should be delete a user by id', async () => {
// 		const res = await service.deleteOne(userId);

// 		expect(res.statusCode).toEqual(HttpStatus.OK);
// 	});

// 	it('should be get a null after deleted user', async () => {
// 		const user = await service.findOne({ _id: userId });

// 		expect(user).toBeFalsy();
// 	});
// });
