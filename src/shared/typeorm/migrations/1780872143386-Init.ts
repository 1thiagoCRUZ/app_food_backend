import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1780872143386 implements MigrationInterface {
    name = 'Init1780872143386'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "courierFee" numeric(10,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "courierFee"`);
    }

}
