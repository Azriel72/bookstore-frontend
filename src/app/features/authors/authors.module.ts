import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { AuthorsRoutingModule } from './authors-routing.module';
import { AuthorListComponent } from './author-list/author-list.component';
import { AuthorFormComponent } from './author-form/author-form.component';

@NgModule({
  declarations: [

  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    AuthorsRoutingModule,
    AuthorListComponent,
    AuthorFormComponent
  ]
})
export class AuthorsModule { }