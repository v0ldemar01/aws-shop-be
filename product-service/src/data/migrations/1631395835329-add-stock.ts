import {MigrationInterface, QueryRunner} from "typeorm";

export class addStock1631395835329 implements MigrationInterface {
    name = 'addStock1631395835329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stock" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "count" integer NOT NULL, "bookId" uuid NOT NULL, CONSTRAINT "REL_1903b05e18dd2b31c45ca877f8" UNIQUE ("bookId"), CONSTRAINT "PK_092bc1fc7d860426a1dec5aa8e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stock" ADD CONSTRAINT "FK_1903b05e18dd2b31c45ca877f89" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock" DROP CONSTRAINT "FK_1903b05e18dd2b31c45ca877f89"`);
        await queryRunner.query(`DROP TABLE "stock"`);
    }

}
