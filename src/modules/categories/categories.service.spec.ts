// // import { HttpStatus } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Test, TestingModule } from '@nestjs/testing';
// import { appConfig } from '../../app.config';
// import { CategoriesService } from './categories.service';
// import { Category, CategorySchema } from './schemas/categories.schema';

// describe('CategoryService', () => {
// 	let service: CategoriesService;
// 	const categoryId = '';

// 	beforeEach(async () => {
// 		const module: TestingModule = await Test.createTestingModule({
// 			imports: [
// 				MongooseModule.forRoot(appConfig.mongoURI),
// 				MongooseModule.forFeature([
// 					{ name: Category.name, schema: CategorySchema },
// 				]),
// 			],
// 			providers: [CategoriesService],
// 		}).compile();

// 		service = module.get<CategoriesService>(CategoriesService);
// 	});

// 	it('should be defined', () => {
// 		expect(service).toBeDefined();
// 	});

// 	it('should be find Categorys with pagination', async () => {
// 		const query = {
// 			limit: 10,
// 			offset: 0,
// 		};

// 		const Categorys = await service.findAll(query);

// 		expect(Categorys.items.length).toEqual(10);
// 	});

// 	it('should be find Categorys with correct result', async () => {
// 		const query = {
// 			limit: 10,
// 			offset: 0,
// 			displayName: 'Category',
// 		};

// 		const Categorys = await service.findAll(query);

// 		if (Categorys.items.length > 0) {
// 			expect(Categorys.items[0]?.name).toContain(query.displayName);
// 		}
// 		expect(Categorys.items.length).toEqual(0);
// 	});

// 	// it('should be create a Category', async () => {
// 	// 	const input: CreateCategoryDto = {
// 	// 		name: 'Test Category',
// 	// 		description: 'testCategory@test.com',
// 	// 		photos: [
// 	// 			{
// 	// 				createdAt: new Date('2023-06-29T07:36:22.758Z'),
// 	// 				updatedAt: new Date('2023-06-29T07:36:22.758Z'),
// 	// 				name: '1688024182737-366333986.jpeg',
// 	// 				imageURL:
// 	// 					'https://hdfitness.vn/wp-content/uploads/2022/02/tap-gym-la-gi-5-min-scaled.jpg',
// 	// 				_id: '649d347672e91c40d2e7e89c',
// 	// 			},
// 	// 		],
// 	// 		// status: CategoryStatus.ACTIVE,
// 	// 	};
// 	// 	// const Category = await service.create(input);

// 	// 	// if (Category) {
// 	// 	// 	categoryId = Category._id;
// 	// 	// }

// 	// 	expect(Category).toBeTruthy();
// 	// 	expect(Category.name).toEqual(input.name);
// 	// });

// 	it('should be find a Category by id', async () => {
// 		const Category = await service.findOne({ _id: categoryId });

// 		expect(Category).toBeTruthy();
// 		expect(Category._id).toEqual(categoryId);
// 	});

// 	it('should be update a Category by id', async () => {
// 		const input: any = {
// 			id: categoryId,
// 			name: 'Updated name',
// 			description: 'Updated description',
// 		};
// 		// const Category = await service.updateOne(input);

// 		expect(Category).toBeTruthy();
// 		expect(Category.name).toEqual(input.name);
// 		// expect(Category.description).toEqual(input.description);
// 	});

// 	// it('should be update the Category avatar', async () => {
// 	// 	const url = 'uri_path';
// 	// 	const Category = await service.updateAvatar(categoryId, url);

// 	// 	expect(Category.avatar).toEqual(url);
// 	// });

// 	// it('should be delete a Category by id', async () => {
// 	// 	const res = await service.deleteOne(categoryId);

// 	// 	expect(res.statusCode).toEqual(HttpStatus.OK);
// 	// });

// 	it('should be get a null after deleted Category', async () => {
// 		const Category = await service.findOne({ _id: categoryId });

// 		expect(Category).toBeFalsy();
// 	});
// });
