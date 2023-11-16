import { Test, TestingModule } from '@nestjs/testing';
import { DetailCartsService } from './detail-carts.service';

describe('DetailCartsService', () => {
	let service: DetailCartsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [DetailCartsService],
		}).compile();

		service = module.get<DetailCartsService>(DetailCartsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
