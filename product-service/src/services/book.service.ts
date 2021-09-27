import { compactDataArray } from 'src/common/helpers/data.helper';
import { IGetConfig } from 'src/common/models/config/IGetConfig';
import { IBook } from 'src/common/models/book/IBook';
import { IBookDto } from 'src/common/models/book/IBookDto';
import { ICreateBookDto } from 'src/common/models/book/ICreateBookDto';
import { IAuthorDto } from 'src/common/models/author/IAuthorDto';
import { ICategoryDto } from 'src/common/models/category/ICategoryDto';
import { IStatusDto } from 'src/common/models/status/IStatusDto';

import DatabaseClient from './database.service';

export default class BookService {
  constructor(
    private readonly dbClient: DatabaseClient
  ) {}

  private generateParametersSequence = (count: number) =>
    Array.from(Array(count), (_, index) => `$${index + 1}${count !== index + 1 ? ',' : ''}`).join(' ');
  
  private readonly coreGetQueryBook =
    `SELECT
      "Book"."id" AS "id", 
      "Book"."createdAt" AS "createdAt", 
      "Book"."updatedAt" AS "updatedAt", 
      "Book"."title" AS "title", 
      "Book"."shortDescription" AS "shortDescription", 
      "Book"."longDescription" AS "longDescription", 
      "Book"."pageCount" AS "pageCount", 
      "Book"."thumbnailUrl" AS "thumbnailUrl", 
      "Book"."publishedDate" AS "publishedDate", 
      "Book"."price" AS "price", 
      "Book__status"."name" AS "status", 
      "Book__authors"."fullName" AS "author",  
      "Book__categories"."name" AS "category", 
      "Book__stock"."count" AS "count"
    FROM "book" "Book" LEFT JOIN "status" "Book__status" ON "Book__status"."id"="Book"."statusId"  
    LEFT JOIN "book_authors_author" "Book_Book__authors" ON "Book_Book__authors"."bookId"="Book"."id" 
    LEFT JOIN "author" "Book__authors" ON "Book__authors"."id"="Book_Book__authors"."authorId"  
    LEFT JOIN "book_categories_category" "Book_Book__categories" ON "Book_Book__categories"."bookId"="Book"."id" 
    LEFT JOIN "category" "Book__categories" ON "Book__categories"."id"="Book_Book__categories"."categoryId"  
    LEFT JOIN "stock" "Book__stock" ON "Book__stock"."bookId"="Book"."id"`;
  
  public async getBooksByConfig({ page, perPage }: IGetConfig): Promise<IBookDto[]> {
    const distinctBooksIdByConfigQuery =
      `SELECT
        DISTINCT "distinctBookAlias"."id" as "id"
      FROM (${this.coreGetQueryBook}) "distinctBookAlias" 
      ORDER BY "id" ASC
      LIMIT ${perPage} 
      OFFSET ${parseInt(page) * parseInt(perPage)};`;
    const bookIds = await this.dbClient.execute<{ id: string }>(distinctBooksIdByConfigQuery);
    const booksByConfigQuery =
      `${this.coreGetQueryBook}
      WHERE "Book"."id" IN
        (${this.generateParametersSequence(parseInt(perPage))});`;
    const books = await this.dbClient.execute<IBook>(booksByConfigQuery, bookIds.map(({ id }) => id));
    return compactDataArray(books, ['author', 'category'], ['authors', 'categories']);
  }

  public async getBookById(id: string): Promise<IBookDto> {
    const query =
      `${this.coreGetQueryBook}
      WHERE "Book"."id" = ($1)`;
    const book = await this.dbClient.execute<IBook>(query, [id]);
    return compactDataArray(book, ['author', 'category'], ['authors', 'categories'])[0];
  }

  public async createBook(book: ICreateBookDto): Promise<string> {
    const { 
      title, 
      shortDescription, 
      longDescription, 
      pageCount, 
      thumbnailUrl, 
      publishedDate, 
      price,
      count 
    } = book;
    try {
      await this.dbClient.execute<void>('BEGIN');
      const createBookQuery =
        `INSERT INTO "book" (
          "id",
          "createdAt",
          "updatedAt",
          "title",
          "shortDescription",
          "longDescription",
          "pageCount",
          "thumbnailUrl",
          "publishedDate",
          "price",
          "statusId"
        ) VALUES (
          DEFAULT,
          DEFAULT,
          DEFAULT,
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8
        ) RETURNING
        "id",
        "createdAt",
        "updatedAt";`;        
      const bookAuthors = await this.getAuthorsByFullName(book.authors);
      const bookCategories = await this.getCategoriesByName(book.categories);
      const bookStatus = await this.getStatusByName(book.status);
      const createdBook = await this.dbClient.execute<IBook>(createBookQuery, [
        title, 
        shortDescription,
        longDescription,
        pageCount.toString(), 
        thumbnailUrl, 
        publishedDate, 
        price.toString(),
        bookStatus[0].id
      ]);
      console.log('createdBook', createdBook);
      await this.createLinkBookAuthor(bookAuthors, createdBook[0].id);
      await this.createLinkBookCategory(bookCategories, createdBook[0].id);
      await this.createStock(createdBook[0].id, book.count)
      await this.dbClient.execute<void>('COMMIT');
      return createdBook[0].id;
    } catch (err) {
      console.log('err', err);
      await this.dbClient.execute('ROLLBACK');
      throw err;
    }    
  }

  private async getAuthorsByFullName(fullNames: string[]) {
    const getBookAuthorsQuery =
      `SELECT 
        "Author"."id" AS "id", 
        "Author"."fullName" AS "fullName"
      FROM "author" "Author"
      WHERE "Author"."fullName" IN
        (${this.generateParametersSequence(fullNames.length)});`;
    return this.dbClient.execute<IAuthorDto>(getBookAuthorsQuery, fullNames);
  }

  private async getCategoriesByName(names: string[]) {
    const getBookCategoriesQuery =
      `SELECT 
        "Category"."id" AS "id", 
        "Category"."name" AS "name"
      FROM "category" "Category"
      WHERE "Category"."name" IN
        (${this.generateParametersSequence(names.length)});`;
    return this.dbClient.execute<ICategoryDto>(getBookCategoriesQuery, names);
  }

  private async getStatusByName(name: string) {
    const getBookStatusQuery =
      `SELECT 
        "Status"."id" AS "id", 
        "Status"."name" AS "name"
      FROM "status" "Status"
      WHERE "Status"."name" = ($1)`;
    return this.dbClient.execute<IStatusDto>(getBookStatusQuery, [name]);
  }

  private async createLinkBookAuthor(bookAuthors: IAuthorDto[], bookId: string) {
    const linkQuery =
      `INSERT INTO "book_authors_author" (
        "bookId",
        "authorId"
      ) VALUES (
        $1,
        $2
      );`;
    for (const bookAuthor of bookAuthors) {
      await this.dbClient.execute<void>(linkQuery, [bookId, bookAuthor.id]);
    }
  }

  private async createLinkBookCategory(bookCategories: ICategoryDto[], bookId: string) {
    const linkQuery =
      `INSERT INTO "book_categories_category" (
        "bookId",
        "categoryId"
      ) VALUES (
        $1,
        $2
      );`;
    for (const bookCategory of bookCategories) {
      await this.dbClient.execute<void>(linkQuery, [bookId, bookCategory.id]);
    }
  }

  private async createStock(bookId: string, count): Promise<void> {
    const query = `INSERT INTO "stock" ("bookId", "count") VALUES ('${bookId}', ${count})`;
    await this.dbClient.execute<void>(query);
  }
}

