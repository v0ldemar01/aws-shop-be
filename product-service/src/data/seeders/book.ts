import { Author } from '../entities/Author';
import { Book } from '../entities/Book';
import { Category } from '../entities/Category';
import { Status } from '../entities/Status';
import { books } from '../seed-data';

export class BookSeeder {
  public static async execute() {
    const authors = await Author.find();
    const categories = await Category.find();
    const status = await Status.find();
    for (const book of books) {
      await Object.assign(new Book(), book, {
        price: Math.floor(Math.random() * 50),
        status: status.find(({ name }) => name === book.status) || status[0],
        authors: book.authors.map(authorName => authors.find(({ fullName }) => fullName === authorName)),
        categories: book.categories.map(categoryName => categories.find(({ name }) => name === categoryName))
      }).save();
    }
  }
}
