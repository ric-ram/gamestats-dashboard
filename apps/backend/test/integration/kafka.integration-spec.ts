// apps/backend/test/integration/kafka.integration-spec.ts

import { DataSource, Repository } from 'typeorm';
import { KafkaContainer, StartedKafkaContainer } from '@testcontainers/kafka';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';

import { ConsumerService } from '../../src/kafka/consumer/consumer.service';
import { Event } from '../../src/events/entities/event.entity';
import { EventsModule } from '../../src/events/events.module';
import { INestApplication } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { KafkaModule } from '../../src/kafka/kafka.module';

describe('Kafka Integration Test', () => {
	let app: INestApplication;
	let kafkaContainer: StartedKafkaContainer;
	let dataSource: DataSource;
	let repo: Repository<Event>;
	let consumerService: ConsumerService;

	beforeAll(async () => {
		kafkaContainer = await new KafkaContainer(
			'confluentinc/cp-kafka:7.9.0',
		).start();
		process.env.KAFKA_BROKERS = `${kafkaContainer.getHost()}:${kafkaContainer.getMappedPort(9093)}`;

		const module: TestingModule = await Test.createTestingModule({
			imports: [
				TypeOrmModule.forRoot({
					type: 'sqlite',
					database: ':memory:',
					entities: [Event],
					synchronize: true,
				}),
				TypeOrmModule.forFeature([Event]),
				KafkaModule,
				EventsModule,
			],
		}).compile();

		app = module.createNestApplication();
		await app.init();

		dataSource = module.get(DataSource);
		await dataSource.runMigrations();

		repo = module.get<Repository<Event>>(getRepositoryToken(Event));
		consumerService = module.get<ConsumerService>(ConsumerService);
		await repo.clear();

		await consumerService.consume(
			{ topics: ['test'], fromBeginning: true },
			{
				// eslint-disable-next-line @typescript-eslint/require-await
				eachMessage: async (payload) => {
					console.log(
						'[Kafka Test] consuming:',
						payload.message.value?.toString(),
					);
				},
			},
		);

		await new Promise((r) => setTimeout(r, 100));
	}, 30000);

	afterAll(async () => {
		await app.close();
		await kafkaContainer.stop();
	}, 30000);

	it('Should consume a produced message and save it to the DB', async () => {
		const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKERS ?? ''] });
		const producer = kafka.producer();
		await producer.connect();
		await producer.send({
			topic: 'test',
			messages: [
				{
					value: JSON.stringify({
						type: 'player_login',
						payload: { userId: 'int-test' },
					}),
				},
			],
		});
		await producer.disconnect();

		await new Promise((r) => setTimeout(r, 500));

		const events = await repo.find();
		expect(events).toHaveLength(1);
		expect(events[0].type).toBe('player_login');
		expect(events[0].payload).toMatchObject({ userId: 'int-test' });
	});
});
