import {MigrationInterface, QueryRunner} from "typeorm";

export class initDatabase1631382392682 implements MigrationInterface {
    name = 'initDatabase1631382392682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "status" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "book" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "shortDescription" character varying, "longDescription" character varying, "pageCount" integer NOT NULL, "thumbnailUrl" character varying, "publishedDate" TIMESTAMP, "statusId" uuid NOT NULL, CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "author" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "fullName" character varying NOT NULL, CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "book_authors_author" ("bookId" uuid NOT NULL, "authorId" uuid NOT NULL, CONSTRAINT "PK_963de00068693ab6e5767de614b" PRIMARY KEY ("bookId", "authorId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9bf58ffb2a12a8609a738ee8ca" ON "book_authors_author" ("bookId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a4cafdf2ec9974524a5321c751" ON "book_authors_author" ("authorId") `);
        await queryRunner.query(`CREATE TABLE "book_categories_category" ("bookId" uuid NOT NULL, "categoryId" uuid NOT NULL, CONSTRAINT "PK_baff6a8cd85658522dd9568a6ba" PRIMARY KEY ("bookId", "categoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3f2c919594cd1b6386240d6d46" ON "book_categories_category" ("bookId") `);
        await queryRunner.query(`CREATE INDEX "IDX_83b564c6e2518a2af3c60ac9da" ON "book_categories_category" ("categoryId") `);
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "FK_4b64d1e5d958c2c11c88da85da3" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_authors_author" ADD CONSTRAINT "FK_9bf58ffb2a12a8609a738ee8cae" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "book_authors_author" ADD CONSTRAINT "FK_a4cafdf2ec9974524a5321c7516" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_categories_category" ADD CONSTRAINT "FK_3f2c919594cd1b6386240d6d464" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "book_categories_category" ADD CONSTRAINT "FK_83b564c6e2518a2af3c60ac9da6" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book_categories_category" DROP CONSTRAINT "FK_83b564c6e2518a2af3c60ac9da6"`);
        await queryRunner.query(`ALTER TABLE "book_categories_category" DROP CONSTRAINT "FK_3f2c919594cd1b6386240d6d464"`);
        await queryRunner.query(`ALTER TABLE "book_authors_author" DROP CONSTRAINT "FK_a4cafdf2ec9974524a5321c7516"`);
        await queryRunner.query(`ALTER TABLE "book_authors_author" DROP CONSTRAINT "FK_9bf58ffb2a12a8609a738ee8cae"`);
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "FK_4b64d1e5d958c2c11c88da85da3"`);
        await queryRunner.query(`DROP INDEX "IDX_83b564c6e2518a2af3c60ac9da"`);
        await queryRunner.query(`DROP INDEX "IDX_3f2c919594cd1b6386240d6d46"`);
        await queryRunner.query(`DROP TABLE "book_categories_category"`);
        await queryRunner.query(`DROP INDEX "IDX_a4cafdf2ec9974524a5321c751"`);
        await queryRunner.query(`DROP INDEX "IDX_9bf58ffb2a12a8609a738ee8ca"`);
        await queryRunner.query(`DROP TABLE "book_authors_author"`);
        await queryRunner.query(`DROP TABLE "author"`);
        await queryRunner.query(`DROP TABLE "book"`);
        await queryRunner.query(`DROP TABLE "status"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
