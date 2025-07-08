import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
	constructor(
		private readonly entityManager: EntityManager,
		@InjectRepository(Event)
		private readonly eventsRepository: Repository<Event>,
	) {}

	async create(createEventDto: CreateEventDto) {
		const event = new Event(createEventDto);
		await this.entityManager.save(event);
	}

	findAll() {
		return this.eventsRepository.find();
	}

	findOne(id: string) {
		return this.eventsRepository.findOneBy({ id });
	}

	async update(id: string, updateEventDto: UpdateEventDto) {
		const event = await this.eventsRepository.findOneBy({ id });
		if (event === null) return;
		event.type = updateEventDto.type;
		await this.entityManager.save(event);
	}

	async remove(id: string) {
		return this.eventsRepository.delete(id);
	}
}
