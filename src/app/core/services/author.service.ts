import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Author } from '../models/author.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private endpoint = 'Authors';

  constructor(private apiService: ApiService) { }

  getAuthors(): Observable<Author[]> {
    return this.apiService.get<Author[]>(this.endpoint);
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