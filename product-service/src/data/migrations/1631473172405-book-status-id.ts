import {MigrationInterface, QueryRunner} from "typeorm";

export class bookRemoveStatusId1631473172405 implements MigrationInterface {
    name = 'bookRemoveStatusId1631473172405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."book" DROP CONSTRAINT "FK_4b64d1e5d958c2c11c88da85da3"`);
        await queryRunner.query(`ALTER TABLE "public"."book" ALTER COLUMN "statusId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."book" ADD CONSTRAINT "FK_4b64d1e5d958c2c11c88da85da3" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."book" DROP CONSTRAINT "FK_4b64d1e5d958c2c11c88da85da3"`);
        await queryRunner.query(`ALTER TABLE "public"."book" ALTER COLUMN "statusId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."book" ADD CONSTRAINT "FK_4b64d1e5d958c2c11c88da85da3" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
