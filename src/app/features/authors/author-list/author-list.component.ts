import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Author } from '../../../core/models/author.model';
import { AuthorService } from '../../../core/services/author.service';
import { BookService } from '../../../core/services/book.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SharedModule } from '../../../shared';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [SharedModule, MatPaginatorModule],
  templateUrl: './author-list.component.html',
  styleUrls: ['./author-list.component.css']
})
export class AuthorListComponent implements OnInit {
  authors: Author[] = [];
  loading = true;
  error = '';

  // Pagination
  pageSize = 9;
  pageNumber = 1;
  totalItems = 0;
  pageSizeOptions = [9, 18, 27];

  constructor(
    private authorService: AuthorService,
    private bookService: BookService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.loading = true;
    this.error = '';

    this.authorService.getAuthors(this.pageNumber, this.pageSize)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          if (response && response.items) {
            this.authors = response.items;
            this.totalItems = response.totalCount;
            // Count the number of books for each author
            this.countAuthorBooks();
          } else {
            this.error = 'Invalid response format from server';
          }
        },
        error: (err) => {
          console.error('Error loading authors:', err);
          this.error = 'Failed to load authors. Please try again later.';
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadAuthors();
  }

  countAuthorBooks(): void {
    // This would ideally be handled by the backend
    // For now, we'll set a placeholder value (would need to fetch books and count)
    this.authors.forEach(author => {
      author.bookCount = Math.floor(Math.random() * 10); // Placeholder value
    });
  }

  editAuthor(id: number): void {
    this.router.navigate(['/authors/edit', id]);
  }

  deleteAuthor(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this author?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.authorService.deleteAuthor(id)
          .pipe(finalize(() => this.loading = false))
          .subscribe({
            next: () => {
              this.authors = this.authors.filter(author => author.id !== id);
              if (this.authors.length === 0 && this.pageNumber > 1) {
                this.pageNumber--;
                this.loadAuthors();
              }
            },
            error: (err) => {
              console.error('Error deleting author:', err);
              this.error = 'Failed to delete author. Please try again later.';
            }
          });
      }
    });
  }
}