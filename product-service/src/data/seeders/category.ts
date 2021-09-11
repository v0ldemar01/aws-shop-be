import { Category } from '../entities/Category';
import { categories } from '../seed-data';

export class CategorySeeder {
  public static async execute() {
    for (const category of categories) {
      await Object.assign(new Category(), {
        name: category
      }).save();
    }
  }
}
