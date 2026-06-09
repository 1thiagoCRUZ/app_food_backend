import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCnhAndPlateToCourier1780974689402 implements MigrationInterface {
    name = 'AddCnhAndPlateToCourier1780974689402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "couriers" ADD "cnh" character varying`);
        await queryRunner.query(`ALTER TABLE "couriers" ADD "vehiclePlate" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "couriers" DROP COLUMN "vehiclePlate"`);
        await queryRunner.query(`ALTER TABLE "couriers" DROP COLUMN "cnh"`);
    }

}
