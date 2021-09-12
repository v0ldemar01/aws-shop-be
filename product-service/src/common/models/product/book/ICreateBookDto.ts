export interface ICreateBookDto {
  title: string;
  pageCount: number;
  publishedDate: Date;
  thumbnailUrl: string;
  shortDescription: string;
  longDescription: string;
  status: string;
  authors: string[];
  categories: string[];
}