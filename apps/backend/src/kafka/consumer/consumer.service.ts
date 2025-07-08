import {
	Consumer,
	ConsumerRunConfig,
	ConsumerSubscribeTopics,
	Kafka,
} from 'kafkajs';
import { Injectable, OnApplicationShutdown } from '@nestjs/common';

import { EventDto } from 'src/events/dto/event.dto';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
	private readonly kafka = new Kafka({
		brokers: ['localhost:9092'],
	});
	private readonly consumers: Consumer[] = [];

	constructor(private readonly eventsService: EventsService) {}

	async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
		const consumer = this.kafka.consumer({ groupId: 'nestjs-kafka' });

		await consumer.connect();
		await consumer.subscribe(topic);
		await consumer.run({
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

			...config,
		});

		this.consumers.push(consumer);
	}

	async onApplicationShutdown() {
		for (const consumer of this.consumers) {
			await consumer.disconnect();
		}
	}
}
function isEventMessage(obj: any): obj is EventDto {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}

	const candidate = obj as Record<string, unknown>;

	if (typeof candidate.type !== 'string') {
		return false;
	}

	if (typeof candidate.payload !== 'object' || candidate.payload === null) {
		return false;
	}

	return true;
}
