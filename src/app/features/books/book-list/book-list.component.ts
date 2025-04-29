import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { Book } from '../../../core/models/book.model';
import { BookService } from '../../../core/services/book.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SharedModule } from '../../../shared';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  loading = true;
  error = '';

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

    this.bookService.getBooks()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (books) => this.books = books,
        error: (err) => this.error = 'Failed to load books. Please try again later.'
      });
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
      width: '500px',
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
            },
            error: (err) => this.error = 'Failed to delete book. Please try again later.'
          });
      }
    });
  }
}