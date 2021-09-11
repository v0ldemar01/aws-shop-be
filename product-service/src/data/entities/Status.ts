import { Book } from './Book';
import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../abstract/AbstractEntity';

@Entity()
export class Status extends AbstractEntity {
  @Column()
  name: string;

  @OneToMany(() => Book, (book) => book.status, {
    cascade: true,
  })
  books: Book[];
}
