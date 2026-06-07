import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhotosBase641780869108071 implements MigrationInterface {
    name = 'AddPhotosBase641780869108071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "photo" text`);
        await queryRunner.query(`ALTER TABLE "restaurants" ADD "photo" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurants" DROP COLUMN "photo"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "photo"`);
    }

}
