import {
	Injectable,
	Logger,
	OnApplicationShutdown,
	OnModuleInit,
} from '@nestjs/common';
import { Kafka, Producer, ProducerRecord, logLevel } from 'kafkajs';

@Injectable()
export class ProducerService
	extends Logger
	implements OnModuleInit, OnApplicationShutdown
{
	private readonly kafka = new Kafka({
		logLevel: logLevel.INFO,
		brokers: [process.env.KAFKA_BROKERS ?? 'localhost:9092'],
		retry: {
			initialRetryTime: 300,
			retries: 8,
			factor: 0.2,
			multiplier: 2,
			maxRetryTime: 30000,
		},
	});

	private readonly producer: Producer = this.kafka.producer();

	async onModuleInit() {
		await this.producer.connect();
		this.log('Kafka producer connected');
	}

	async produce(record: ProducerRecord) {
		try {
			await this.producer.send(record);
			this.log(`Produced record to topic: ${record.topic}`);
		} catch (error) {
			this.error('Producer failed to send record', error);
			throw error;
		}
	}
	async onApplicationShutdown() {
		await this.producer.disconnect();
		this.log('Kafka producer disconnected');
	}
}
