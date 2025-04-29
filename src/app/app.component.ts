import { Component } from '@angular/core';
import { CoreModule } from './core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CoreModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Book & Author Management';
}