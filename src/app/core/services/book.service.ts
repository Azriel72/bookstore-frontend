import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Book } from '../models/book.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private endpoint = 'books';

  constructor(private apiService: ApiService) { }

  getBooks(): Observable<Book[]> {
    return this.apiService.get<Book[]>(this.endpoint);
  }

  getBookById(id: number): Observable<Book> {
    return this.apiService.getById<Book>(this.endpoint, id);
  }

  createBook(book: Book): Observable<Book> {
    return this.apiService.post<Book>(this.endpoint, book);
  }

  updateBook(id: number, book: Book): Observable<Book> {
    return this.apiService.put<Book>(this.endpoint, id, book);
  }

  deleteBook(id: number): Observable<any> {
    return this.apiService.delete(this.endpoint, id);
  }
}