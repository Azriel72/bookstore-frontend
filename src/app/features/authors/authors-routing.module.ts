import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorListComponent } from './author-list/author-list.component';
import { AuthorFormComponent } from './author-form/author-form.component';

const routes: Routes = [
  { path: '', component: AuthorListComponent },
  { path: 'new', component: AuthorFormComponent },
  { path: 'edit/:id', component: AuthorFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorsRoutingModule { }