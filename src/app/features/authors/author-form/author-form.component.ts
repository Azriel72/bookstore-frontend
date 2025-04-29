import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Author } from '../../../core/models/author.model';
import { AuthorService } from '../../../core/services/author.service';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-author-form',
  imports: [SharedModule],
  templateUrl: './author-form.component.html',
  styleUrls: ['./author-form.component.css']
})
export class AuthorFormComponent implements OnInit {
  authorForm!: FormGroup;
  isEditMode = false;
  authorId: number | null = null;
  loading = false;
  submitting = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authorService: AuthorService
  ) { }

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.authorId = +id;
      this.loadAuthor(+id);
    }
  }

  initForm(): void {
    this.authorForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  loadAuthor(id: number): void {
    this.loading = true;
    this.error = '';

    this.authorService.getAuthorById(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (author) => {
          this.authorForm.patchValue(author);
        },
        error: (err) => this.error = 'Failed to load author details. Please try again later.'
      });
  }

  onSubmit(): void {
    if (this.authorForm.invalid) {
      return;
    }

    this.submitting = true;
    this.error = '';
    this.success = '';

    const authorData: Author = this.authorForm.value;

    if (this.isEditMode && this.authorId) {
      this.authorService.updateAuthor(this.authorId, authorData)
        .pipe(finalize(() => this.submitting = false))
        .subscribe({
          next: () => {
            this.success = 'Author updated successfully';
            setTimeout(() => this.router.navigate(['/authors']), 1500);
          },
          error: (err) => this.error = 'Failed to update author. Please try again later.'
        });
    } else {
      this.authorService.createAuthor(authorData)
        .pipe(finalize(() => this.submitting = false))
        .subscribe({
          next: () => {
            this.success = 'Author created successfully';
            setTimeout(() => this.router.navigate(['/authors']), 1500);
          },
          error: (err) => this.error = 'Failed to create author. Please try again later.'
        });
    }
  }

  cancel(): void {
    this.router.navigate(['/authors']);
  }
}