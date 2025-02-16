import { Component, ViewEncapsulation, inject, viewChild } from '@angular/core';
import { TuiThemeColorService } from '@taiga-ui/cdk';
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
  readonly #theme = inject(TuiThemeColorService);
  readonly #supabase = inject(SupabaseService);
  static readonly themeColor = '#6c86e2';

  drawerToggle = viewChild<HeaderComponent>('header');

  get userId() {
    return this.#supabase?.logged ?? '';
  }

  constructor() {
    this.#theme.color = MenuComponent.themeColor;
  }

  closeDrawer() {
    this.drawerToggle()?.closeDrawer();
  }
}
