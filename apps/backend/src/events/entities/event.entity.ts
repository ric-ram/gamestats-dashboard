import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'events' })
export class Event {
	@PrimaryGeneratedColumn()
	id!: string;

	@Column({ type: 'varchar', length: 50 })
	type: string;

	@Column({ type: 'json' })
	payload: any;

	@CreateDateColumn({ type: 'timestamp' })
	timestamp: Date;

	constructor(event: Partial<Event>) {
		Object.assign(this, event);
	}
}
