import { Author } from './author.model';

export interface Book {
  id: number;
  title: string;
  description: string;
  pageCount: number;
  excerpt: string;
  publishDate: string;
  authorId?: number;
  author?: Author;
}