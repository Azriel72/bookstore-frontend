import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { Book } from '../../../core/models/book.model';
import { BookService } from '../../../core/services/book.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SharedModule } from '../../../shared';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule, MatPaginatorModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  loading = false;
  error = '';

  // Pagination
  pageSize = 9;
  pageNumber = 1;
  totalItems = 0;
  pageSizeOptions = [9, 18, 27];

  constructor(
    private bookService: BookService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.error = '';
    this.books = []; // Limpiar los libros antes de cargar nuevos

    this.bookService.getBooks(this.pageNumber, this.pageSize)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          if (response && response.items) {
            this.books = response.items;
            this.totalItems = response.totalCount;
          } else {
            this.error = 'Invalid response format from server';
          }
        },
        error: (err) => {
          console.error('Error loading books:', err);
          this.error = 'Failed to load books. Please try again later.';
          this.books = [];
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadBooks();
  }

  viewBookDetails(id: number): void {
    this.router.navigate(['/books', id]);
  }

  editBook(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/books', id, 'edit']);
  }

  deleteBook(id: number, event: Event): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this book?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.bookService.deleteBook(id)
          .pipe(finalize(() => this.loading = false))
          .subscribe({
            next: () => {
              this.books = this.books.filter(book => book.id !== id);
              if (this.books.length === 0 && this.pageNumber > 1) {
                this.pageNumber--;
              }
              this.loadBooks();
            },
            error: (err) => {
              console.error('Error deleting book:', err);
              this.error = 'Failed to delete book. Please try again later.';
            }
          });
      }
    });
  }
}