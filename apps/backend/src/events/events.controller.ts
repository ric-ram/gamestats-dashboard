import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
	constructor(private readonly eventsService: EventsService) {}

	@Post()
	async create(@Body() createEventDto: CreateEventDto) {
		return this.eventsService.create(createEventDto);
	}

	@Get()
	async findAll() {
		return this.eventsService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return this.eventsService.findOne(id);
	}

	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body() updateEventDto: UpdateEventDto,
	) {
		return this.eventsService.update(id, updateEventDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.eventsService.remove(id);
	}
}
