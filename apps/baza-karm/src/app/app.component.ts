import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedMenuComponent } from '@projekty/shared-ui';
import { SupabaseService } from './services/supabase.service';

@Component({
  standalone: true,
  imports: [RouterModule, SharedMenuComponent],
  selector: 'bk-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'baza-karm';

  private readonly supabase = inject(SupabaseService);

  ngOnInit() {
    this.supabase.init();
    this.supabase.products();
  }
}
