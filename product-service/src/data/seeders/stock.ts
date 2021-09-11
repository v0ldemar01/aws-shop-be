import { Book } from '../entities/Book';
import { Stock } from '../entities/Stock';

export class StockSeeder {
  public static async execute() {
    const books = await Book.find();
    for (const book of books) {
      await Object.assign(new Stock(), {
        book,
        count: Math.floor(Math.random() * 10)
      }).save();
    }
  }
}