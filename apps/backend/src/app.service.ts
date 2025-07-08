import { EventDto } from './events/dto/event.dto';
import { EventsService } from './events/events.service';
import { Injectable } from '@nestjs/common';
import { ProducerService } from './kafka/producer/producer.service';

@Injectable()
export class AppService {
	constructor(
		private readonly producerService: ProducerService,
		private readonly eventsService: EventsService,
	) {}

	async produceAndSave(): Promise<string> {
		const dto: EventDto = {
			type: 'player_login',
			payload: { userId: 'u123' },
		};

		// 1) send to Kafka
		await this.producerService.produce({
			topic: 'test',
			messages: [{ value: JSON.stringify(dto) }],
		});

		// 2) immediately persist
		const saved = await this.eventsService.record(dto);
		return `Produced event and saved with id ${saved.id}`;
	}
}
