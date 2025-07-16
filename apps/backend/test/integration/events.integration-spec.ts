// apps/backend/test/integration/events.integration-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';

import { Event } from '../../src/events/entities/event.entity';
import { EventDto } from '../../src/events/dto/event.dto';
import { EventsService } from '../../src/events/events.service';
import { Repository } from 'typeorm';

describe('EventsService Integration Test', () => {
	let service: EventsService;
	let repo: Repository<Event>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				TypeOrmModule.forRoot({
					type: 'sqlite',
					database: ':memory:',
					entities: [Event],
					synchronize: true,
				}),
				TypeOrmModule.forFeature([Event]),
			],
			providers: [EventsService],
		}).compile();

		service = module.get(EventsService);
		repo = module.get<Repository<Event>>(getRepositoryToken(Event));
	});

	beforeEach(() => repo.clear());

	it('Should save a valid event', async () => {
		const dto: EventDto = { type: 'level_complete', payload: { level: 3 } };
		const saved = await service.record(dto);

		expect(saved.id).toBeDefined();
		expect(saved.type).toBe(dto.type);
		expect(saved.payload).toMatchObject(dto.payload);

		const rows = await repo.find();
		expect(rows).toHaveLength(1);
	});

	it('Should reject missing type', async () => {
		// @ts-expect-error simulate invalid payload
		await expect(service.record({ payload: {} })).rejects.toThrow();

		const rows = await repo.find();
		expect(rows).toHaveLength(0);
	});
});
