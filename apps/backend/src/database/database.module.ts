import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'mariadb',
				host: configService.getOrThrow('DB_HOST'),
				port: configService.getOrThrow('DB_PORT'),
				database: configService.getOrThrow('DB_NAME'),
				username: configService.getOrThrow('DB_USER'),
				password: configService.getOrThrow('DB_PASS'),
				autoLoadEntities: true,
				synchronize: configService.getOrThrow('DB_SYNC'),
			}),
		}),
	],
	exports: [TypeOrmModule],
})
export class DatabaseModule {}
