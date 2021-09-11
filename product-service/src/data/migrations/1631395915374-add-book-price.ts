import {MigrationInterface, QueryRunner} from "typeorm";

export class addBookPrice1631395915374 implements MigrationInterface {
    name = 'addBookPrice1631395915374'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."book" ADD "price" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."book" DROP COLUMN "price"`);
    }

}
