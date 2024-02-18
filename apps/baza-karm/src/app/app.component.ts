import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedMenuComponent } from '@projekty/shared-ui';

@Component({
  standalone: true,
  imports: [RouterModule, SharedMenuComponent],
  selector: 'bk-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'baza-karm';
}
