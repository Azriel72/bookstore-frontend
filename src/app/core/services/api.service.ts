import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    console.log('API URL:', this.apiUrl); // Log the API URL for debugging
  }

  get<T>(endpoint: string, params?: { [key: string]: any }): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] != null) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    const url = `${this.apiUrl}/${endpoint}`;
    console.log('Making GET request to:', url, 'with params:', params); // Log request details

    return this.http.get<T>(url, { ...this.httpOptions, params: httpParams })
      .pipe(
        tap(response => console.log('Response received:', response)),
        catchError(error => {
          console.error('API Error:', error);
          console.error('Status:', error.status);
          console.error('Message:', error.message);
          console.error('Error body:', error.error);
          throw error;
        })
      );
  }

  getById<T>(endpoint: string, id: number): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}/${id}`;
    console.log('Making GET by ID request to:', url);
    return this.http.get<T>(url).pipe(
      tap(response => console.log('Response received:', response)),
      catchError(error => {
        console.error('API Error:', error);
        throw error;
      })
    );
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    console.log('Making POST request to:', url, 'with data:', data);
    return this.http.post<T>(url, data, this.httpOptions).pipe(
      tap(response => console.log('Response received:', response)),
      catchError(error => {
        console.error('API Error:', error);
        throw error;
      })
    );
  }

  put<T>(endpoint: string, id: number, data: any): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}/${id}`;
    console.log('Making PUT request to:', url, 'with data:', data);
    return this.http.put<T>(url, data, this.httpOptions).pipe(
      tap(response => console.log('Response received:', response)),
      catchError(error => {
        console.error('API Error:', error);
        throw error;
      })
    );
  }

  delete<T>(endpoint: string, id: number): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}/${id}`;
    console.log('Making DELETE request to:', url);
    return this.http.delete<T>(url).pipe(
      tap(response => console.log('Response received:', response)),
      catchError(error => {
        console.error('API Error:', error);
        throw error;
      })
    );
  }
}