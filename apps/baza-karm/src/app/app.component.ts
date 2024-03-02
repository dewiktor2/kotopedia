import { Component, ViewEncapsulation, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedMenuComponent } from '@projekty/shared-ui';
import { SupabaseService } from './services/supabase.service';
import { CultureService } from './services/culture.service';


@Component({
  standalone: true,
  imports: [RouterModule, SharedMenuComponent],
  selector: 'bk-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'baza-karm';

  private readonly supabase = inject(SupabaseService);

  constructor(private readonly cultureService: CultureService) {
    // The culture will be set when the service is instantiated
  }
}
