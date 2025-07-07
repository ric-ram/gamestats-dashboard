import { ConsumerService } from './consumer/consumer.service';
import { Module } from '@nestjs/common';
import { ProducerService } from './producer/producer.service';

@Module({
	providers: [ProducerService, ConsumerService],
	exports: [ProducerService, ConsumerService],
})
export class KafkaModule {}
