import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';
import { ApiService } from './api.service';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private endpoint = 'Books';

  constructor(private apiService: ApiService) { }

  getBooks(pageNumber: number = 1, pageSize: number = 9): Observable<PaginatedResponse<Book>> {
    return this.apiService.get<PaginatedResponse<Book>>(this.endpoint, {
      pageNumber,
      pageSize
    });
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