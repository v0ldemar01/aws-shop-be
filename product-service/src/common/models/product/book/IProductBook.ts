export interface IProductBook {
  title: string;
  isbn: string;
  pageCount: number;
  publishedDate: { $date: Date }
  thumbnailUrl: string;
  shortDescription: string;
  longDescription: string;
  status: string;
  authors: string[];
  categories: string[];
}