import { ConsumerService } from './consumer/consumer.service';
import { EventsModule } from '../events/events.module';
import { Module } from '@nestjs/common';
import { ProducerService } from './producer/producer.service';

@Module({
	imports: [EventsModule],
	providers: [ProducerService, ConsumerService],
	exports: [ProducerService, ConsumerService],
})
export class KafkaModule {}
