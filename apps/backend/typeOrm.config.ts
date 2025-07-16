import { DataSource } from 'typeorm';
import { Event } from './src/events/entities/event.entity';
import { config } from 'dotenv';

config();

export default new DataSource({
	type: 'mariadb',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	migrations: ['migrations/**'],
	entities: [Event],
});
