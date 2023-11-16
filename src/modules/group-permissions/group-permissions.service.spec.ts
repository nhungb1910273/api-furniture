import { Test, TestingModule } from '@nestjs/testing';
import { GroupPermissionsService } from './group-permissions.service';

describe('GroupPermissionsService', () => {
	let service: GroupPermissionsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [GroupPermissionsService],
		}).compile();

		service = module.get<GroupPermissionsService>(GroupPermissionsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
