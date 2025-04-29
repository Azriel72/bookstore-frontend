import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Book } from '../../../core/models/book.model';
import { Author } from '../../../core/models/author.model';
import { BookService } from '../../../core/services/book.service';
import { AuthorService } from '../../../core/services/author.service';
import { SharedModule } from '../../../shared';

@Component({
  selector: 'app-book-detail',
  imports: [SharedModule],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  author: Author | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private authorService: AuthorService
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadBook(id);
  }

  loadBook(id: number): void {
    this.loading = true;
    this.error = '';
    
    this.bookService.getBookById(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (book) => {
          this.book = book;
          if (book.authorId) {
            this.loadAuthor(book.authorId);
          }
        },
        error: (err) => this.error = 'Failed to load book details. Please try again later.'
      });
  }

  loadAuthor(authorId: number): void {
    this.authorService.getAuthorById(authorId)
      .subscribe({
        next: (author) => this.author = author,
        error: (err) => console.error('Failed to load author details', err)
      });
  }

  goBack(): void {
    this.router.navigate(['/books']);
  }

  editBook(): void {
    if (this.book) {
      this.router.navigate(['/books/edit', this.book.id]);
    }
  }
}