import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1751975009407 implements MigrationInterface {
	name = 'Initial1751975009407';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE \`events\` DROP PRIMARY KEY`);
		await queryRunner.query(`ALTER TABLE \`events\` DROP COLUMN \`id\``);
		await queryRunner.query(
			`ALTER TABLE \`events\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE \`events\` DROP COLUMN \`id\``);
		await queryRunner.query(
			`ALTER TABLE \`events\` ADD \`id\` varchar(36) NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE \`events\` ADD PRIMARY KEY (\`id\`)`,
		);
	}
}
