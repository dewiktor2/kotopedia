import { Component, ViewEncapsulation, inject, viewChild } from '@angular/core';
import { SupabaseService } from '../../../services/supabase.service';
import { HeaderComponent } from './components/header.component';
import { MobileDrawerComponent } from './components/mobile-nav.component';

@Component({
  imports: [HeaderComponent, MobileDrawerComponent],
  selector: 'bk-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MenuComponent {
  readonly #supabase = inject(SupabaseService);

  drawerToggle = viewChild<HeaderComponent>('header');

  get userId() {
    return this.#supabase?.logged ?? '';
  }

  closeDrawer() {
    this.drawerToggle()?.closeDrawer();
  }
}
