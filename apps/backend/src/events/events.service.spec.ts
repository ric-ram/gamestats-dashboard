import { Test, TestingModule } from '@nestjs/testing';

import { Event } from './entities/event.entity';
import { EventDto } from './dto/event.dto';
import { EventsService } from './events.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

type MockRepo = Partial<Record<keyof Repository<Event>, jest.Mock>>;

describe('EventsService', () => {
	let service: EventsService;
	let repo: MockRepo;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
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

		service = module.get<EventsService>(EventsService);
		repo = module.get(getRepositoryToken(Event));
	});

	it('should create and save an eevent', async () => {
		const dto = { type: 'player_login', payload: { userId: 'abc' } };
		const result = await service.record(dto);

		expect(repo.create).toHaveBeenCalledWith(dto);
		expect(repo.save).toHaveBeenCalledWith(dto);
		expect(result).toEqual({ id: 'abc', ...dto });
	});

	it('should propagate repository errors', async () => {
		(repo.save as jest.Mock).mockRejectedValueOnce(new Error('DB down'));
		await expect(
			service.record({ type: 'x', payload: {} }),
		).rejects.toThrow('DB down');
	});
});
