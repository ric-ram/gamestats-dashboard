import * as request from 'supertest';

import { DataSource, Repository } from 'typeorm';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { KafkaContainer, StartedKafkaContainer } from '@testcontainers/kafka';
import {
	MariaDbContainer,
	StartedMariaDbContainer,
} from '@testcontainers/mariadb';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../../src/app.module';
import { Event } from '../../src/events/entities/event.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('E2E: Kafka → NestJS → MariaDB', () => {
	let app: INestApplication;
	let kafkaContainer: StartedKafkaContainer;
	let mariadb: StartedMariaDbContainer;
	let dataSource: DataSource;
	let repo: Repository<Event>;

	beforeAll(async () => {
		kafkaContainer = await new KafkaContainer(
			'confluentinc/cp-kafka:7.9.0',
		).start();
		const broker = `localhost:${kafkaContainer.getMappedPort(9093)}`;
		process.env.KAFKA_BROKER = broker;

		mariadb = await new MariaDbContainer('mariadb:11.5.2').start();
		process.env.DB_HOST = mariadb.getHost();
		process.env.DB_PORT = mariadb.getMappedPort(3306).toString();
		process.env.DB_USER = mariadb.getUsername();
		process.env.DB_PASS = mariadb.getUserPassword();
		process.env.DB_NAME = mariadb.getDatabase();
		process.env.DB_SYNC = 'false';

		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
		await app.init();

		dataSource = moduleFixture.get(DataSource);
		await dataSource.runMigrations();

		repo = moduleFixture.get<Repository<Event>>(getRepositoryToken(Event));
		await repo.clear();
	}, 300000);

	afterAll(async () => {
		await app.close();
		await kafkaContainer.stop();
		await mariadb.stop();
	});

	it('GET /produce-and-save should produce to Kafka AND save to DB', async () => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const resp = await request(app.getHttpServer())
			.get('/produce-and-save')
			.expect(200);

		expect(resp.text).toMatch(/Produced event and saved with id [\w-]+/);

		await new Promise((r) => setTimeout(r, 500));

		const events = await repo.find();
		expect(events).toHaveLength(1);
		expect(events[0].type).toBe('player_login');
		expect(events[0].payload).toMatchObject({ userId: 'u123' });
	});
});
