import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Book } from '../../../core/models/book.model';
import { Author } from '../../../core/models/author.model';
import { BookService } from '../../../core/services/book.service';
import { AuthorService } from '../../../core/services/author.service';
import { SharedModule } from '../../../shared';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
  bookForm!: FormGroup;
  authors: Author[] = [];
  isEditMode = false;
  bookId: number | null = null;
  loading = false;
  submitting = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private authorService: AuthorService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadAuthors();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.bookId = +id;
      this.loadBook(+id);
    }
  }

  initForm(): void {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required]],
      pageCount: [0, [Validators.required, Validators.min(1)]],
      excerpt: [''],
      publishDate: ['', Validators.required],
      authorId: ['', Validators.required]
    });
  }

  loadAuthors(): void {
    this.authorService.getAuthors()
      .subscribe({
        next: (response) => {
          if (response && response.items) {
            this.authors = response.items;
          } else {
            this.error = 'Failed to load authors. Invalid response format.';
          }
        },
        error: (err) => {
          console.error('Error loading authors:', err);
          this.error = 'Failed to load authors. Please try again later.';
        }
      });
  }

  loadBook(id: number): void {
    this.loading = true;
    this.error = '';

    this.bookService.getBookById(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (book) => {
          // Format date for the form
          if (book.publishDate) {
            book.publishDate = new Date(book.publishDate).toISOString().split('T')[0];
          }
          this.bookForm.patchValue(book);
        },
        error: (err) => {
          console.error('Error loading book:', err);
          this.error = 'Failed to load book details. Please try again later.';
        }
      });
  }

  onSubmit(): void {
    if (this.bookForm.invalid) {
      return;
    }

    this.submitting = true;
    this.error = '';
    this.success = '';

    const bookData: Book = this.bookForm.value;

    if (this.isEditMode && this.bookId) {
      this.bookService.updateBook(this.bookId, bookData)
        .pipe(finalize(() => this.submitting = false))
        .subscribe({
          next: () => {
            this.success = 'Book updated successfully';
            setTimeout(() => this.router.navigate(['/books']), 1500);
          },
          error: (err) => {
            console.error('Error updating book:', err);
            this.error = 'Failed to update book. Please try again later.';
          }
        });
    } else {
      this.bookService.createBook(bookData)
        .pipe(finalize(() => this.submitting = false))
        .subscribe({
          next: () => {
            this.success = 'Book created successfully';
            setTimeout(() => this.router.navigate(['/books']), 1500);
          },
          error: (err) => {
            console.error('Error creating book:', err);
            this.error = 'Failed to create book. Please try again later.';
          }
        });
    }
  }

  cancel(): void {
    this.router.navigate(['/books']);
  }
}