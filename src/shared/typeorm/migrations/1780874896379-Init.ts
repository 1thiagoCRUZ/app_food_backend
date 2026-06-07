import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1780874896379 implements MigrationInterface {
    name = 'Init1780874896379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "subtotal" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "discount" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "couponCode" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "couponCode"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "discount"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "subtotal"`);
    }

}
