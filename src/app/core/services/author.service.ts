import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Author } from '../models/author.model';
import { ApiService } from './api.service';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private endpoint = 'Authors';

  constructor(private apiService: ApiService) { }

  getAuthors(pageNumber: number = 1, pageSize: number = 9): Observable<PaginatedResponse<Author>> {
    return this.apiService.get<PaginatedResponse<Author>>(this.endpoint, {
      pageNumber,
      pageSize
    });
  }

  getAuthorById(id: number): Observable<Author> {
    return this.apiService.getById<Author>(this.endpoint, id);
  }

  createAuthor(author: Author): Observable<Author> {
    return this.apiService.post<Author>(this.endpoint, author);
  }

  updateAuthor(id: number, author: Author): Observable<Author> {
    return this.apiService.put<Author>(this.endpoint, id, author);
  }

  deleteAuthor(id: number): Observable<any> {
    return this.apiService.delete(this.endpoint, id);
  }
}