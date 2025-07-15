import {
	Consumer,
	ConsumerRunConfig,
	ConsumerSubscribeTopics,
	Kafka,
	logLevel,
} from 'kafkajs';
import { Injectable, OnApplicationShutdown } from '@nestjs/common';

import { EventsService } from '../../events/events.service';
import { isEventMessage } from '../types/types';
import { retry } from 'src/common/retry.helper';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
	private readonly kafka = new Kafka({
		brokers: [process.env.KAFKA_BROKERS ?? 'localhost:9092'],
		logLevel: logLevel.INFO,
		retry: {
			initialRetryTime: 300,
			retries: 5,
		},
	});
	private readonly consumers: Consumer[] = [];
	private shuttingDown = false;

	constructor(private readonly eventsService: EventsService) {}

	async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
		const consumer = this.kafka.consumer({ groupId: 'nestjs-kafka' });
		consumer.on(
			consumer.events.CRASH,
			({ payload: { error, groupId } }) => {
				console.error(`Consumer group ${groupId} crashed:`, error); // :contentReference[oaicite:1]{index=1}
			},
		);

		await consumer.connect();
		await consumer.subscribe(topic);
		await consumer.run({
			...config,
			eachMessage: async (payload) => {
				if (this.shuttingDown) {
					// Skip new messages once shutdown starts
					return;
				}

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
				await retry(() => this.eventsService.record(parsed), 3, 200);
			},
		});

		this.consumers.push(consumer);
	}

	async onApplicationShutdown() {
		this.shuttingDown = true;
		await Promise.all(this.consumers.map((c) => c.disconnect()));
	}
}
