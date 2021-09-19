import { ICreateBookDto } from './ICreateBookDto';

export interface IBookDto extends ICreateBookDto {
  id: string;
}