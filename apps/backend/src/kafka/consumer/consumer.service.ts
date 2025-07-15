import {
	Consumer,
	ConsumerRunConfig,
	ConsumerSubscribeTopics,
	Kafka,
} from 'kafkajs';
import { Injectable, OnApplicationShutdown } from '@nestjs/common';

import { EventsService } from '../../events/events.service';
import { isEventMessage } from '../types/types';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
	private readonly kafka = new Kafka({
		brokers: [process.env.KAFKA_BROKERS ?? 'localhost:9092'],
	});
	private readonly consumers: Consumer[] = [];

	constructor(private readonly eventsService: EventsService) {}

	async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
		const consumer = this.kafka.consumer({ groupId: 'nestjs-kafka' });

		await consumer.connect();
		await consumer.subscribe(topic);
		await consumer.run({
			...config,
			eachMessage: async (payload) => {
				if (config.eachMessage) {
					await config.eachMessage(payload);
				}

				const raw = payload.message.value?.toString() ?? '';
				let parsed: unknown;
				try {
					parsed = JSON.parse(raw);
				} catch {
					console.warn('Skipping non-JSON message:', raw);
					return;
				}

				if (!isEventMessage(parsed)) {
					console.warn('Invalid event shape:', parsed);
					return;
				}
				await this.eventsService.record(parsed);
			},
		});

		this.consumers.push(consumer);
	}

	async onApplicationShutdown() {
		for (const consumer of this.consumers) {
			await consumer.disconnect();
		}
	}
}
