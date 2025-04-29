import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookFormComponent } from './book-form/book-form.component';

const routes: Routes = [
  {
    path: '',
    component: BookListComponent
  },
  {
    path: 'new',
    component: BookFormComponent
  },
  {
    path: ':id',
    component: BookDetailComponent
  },
  {
    path: ':id/edit',
    component: BookFormComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class BooksModule { }