import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { KafkaModule } from './kafka/kafka.module';
import { Module } from '@nestjs/common';
import { join } from 'path';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [
				join(process.cwd(), '.env'),
				join(process.cwd(), '../..', '.env'),
			],
		}),
		KafkaModule,
		DatabaseModule,
		EventsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
