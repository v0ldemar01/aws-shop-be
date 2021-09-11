import { Column, Entity, ManyToMany } from 'typeorm';
import { AbstractEntity } from '../abstract/AbstractEntity';
import { Book } from './Book';
  
@Entity()
export class Category extends AbstractEntity {
  @Column()
  name: string;
  
  @ManyToMany(() => Book, book => book.categories)
  books: Book[];
}
  