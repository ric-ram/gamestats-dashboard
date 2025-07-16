import { Test, TestingModule } from '@nestjs/testing';

import { ConsumerService } from './consumer.service';
import { EventDto } from '../../events/dto/event.dto';
import { EventsService } from '../../events/events.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ConsumerService', () => {
	let service: ConsumerService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ConsumerService,
				EventsService,
				{
					provide: getRepositoryToken(Event),
					useValue: {
						create: jest
							.fn()
							.mockImplementation((dto: EventDto) => dto),
						save: jest
							.fn()
							.mockImplementation((event) =>
								Promise.resolve({ id: 'abc', ...event }),
							),
					},
				},
			],
		}).compile();

		service = module.get<ConsumerService>(ConsumerService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
