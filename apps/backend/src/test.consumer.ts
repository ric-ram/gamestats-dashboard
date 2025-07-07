import { Injectable, OnModuleInit } from '@nestjs/common';

import { ConsumerService } from './kafka/consumer/consumer.service';

function createEmptyPromise(): Promise<void> {
	return Promise.resolve();
}

@Injectable()
export class TestConsumer implements OnModuleInit {
	constructor(private readonly consumerService: ConsumerService) {}

	async onModuleInit() {
		await this.consumerService.consume(
			{ topics: ['test'] },
			{
				eachMessage: async ({ topic, partition, message }) => {
					await createEmptyPromise();

					console.log({
						value: message.value?.toString(),
						topic: topic.toString(),
						partition: partition.toString(),
					});
				},
			},
		);
	}
}
