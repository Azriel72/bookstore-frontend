import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'books',
    loadChildren: () => import('./features/books/books.module').then(m => m.BooksModule)
  },
  {
    path: 'authors',
    loadChildren: () => import('./features/authors/authors.module').then(m => m.AuthorsModule)
  },
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  { path: '**', redirectTo: '/books' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }