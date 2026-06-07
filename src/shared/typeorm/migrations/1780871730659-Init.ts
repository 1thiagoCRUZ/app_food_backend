import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1780871730659 implements MigrationInterface {
    name = 'Init1780871730659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "courierId" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "courierId"`);
    }

}
