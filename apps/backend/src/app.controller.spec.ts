import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
	let appController: AppController;
	let appService: Partial<Record<keyof AppService, jest.Mock>>;

	beforeEach(async () => {
		appService = {
			produceAndSave: jest
				.fn()
				.mockResolvedValue('Produced + saved id abc'),
		};

		const app: TestingModule = await Test.createTestingModule({
			controllers: [AppController],
			providers: [
				{
					provide: AppService,
					useValue: appService,
				},
			],
		}).compile();

		appController = app.get<AppController>(AppController);
	});

	describe('produceAndSave()', () => {
		it('should call AppService.produceAndSave and return its result', async () => {
			const result = await appController.produceAndSave?.();
			expect(appService.produceAndSave).toHaveBeenCalled();
			expect(result).toBe('Produced + saved id abc');
		});
	});
});
