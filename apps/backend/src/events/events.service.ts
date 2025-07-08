import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventDto } from './dto/event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
	constructor(
		@InjectRepository(Event)
		private readonly eventsRepository: Repository<Event>,
	) {}

	async record(event: EventDto) {
		console.log('Saving event to DB:', event);
		const entity = this.eventsRepository.create({
			type: event.type,
			payload: event.payload,
		});
		const saved = await this.eventsRepository.save(entity);
		console.log('Saved entity:', saved);
		return saved;
	}
}
