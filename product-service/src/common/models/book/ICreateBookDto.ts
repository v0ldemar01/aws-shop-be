export interface ICreateBookDto {
  title: string;
  pageCount: number;
  publishedDate: string;
  thumbnailUrl: string;
  shortDescription: string;
  longDescription: string;
  status: string;
  authors: string[];
  categories: string[];
  price: number;
  count: number;
}