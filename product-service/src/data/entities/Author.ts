import { Column, Entity, ManyToMany } from 'typeorm';
import { AbstractEntity } from '../abstract/AbstractEntity';
import { Book } from './Book';
  
@Entity()
export class Author extends AbstractEntity {
  @Column()
  fullName: string;
  
  @ManyToMany(() => Book, book => book.authors)
  books: Book[];
}
  