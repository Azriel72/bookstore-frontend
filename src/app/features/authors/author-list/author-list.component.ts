import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Author } from '../../../core/models/author.model';
import { AuthorService } from '../../../core/services/author.service';
import { BookService } from '../../../core/services/book.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SharedModule } from '../../../shared';

@Component({
  selector: 'app-author-list',
  imports: [SharedModule],
  templateUrl: './author-list.component.html',
  styleUrls: ['./author-list.component.css']
})
export class AuthorListComponent implements OnInit {
  authors: Author[] = [];
  loading = true;
  error = '';

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

    this.authorService.getAuthors()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (authors) => {
          this.authors = authors;
          // Count the number of books for each author
          this.countAuthorBooks();
        },
        error: (err) => this.error = 'Failed to load authors. Please try again later.'
      });
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
      width: '350px',
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
            },
            error: (err) => this.error = 'Failed to delete author. Please try again later.'
          });
      }
    });
  }
}