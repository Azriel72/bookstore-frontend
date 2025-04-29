import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { BooksRoutingModule } from './books-routing.module';
import { BookListComponent } from './book-list/book-list.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookFormComponent } from './book-form/book-form.component';

@NgModule({
  declarations: [

  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    BooksRoutingModule,
    BookListComponent,
    BookDetailComponent,
    BookFormComponent
  ]
})
export class BooksModule { }