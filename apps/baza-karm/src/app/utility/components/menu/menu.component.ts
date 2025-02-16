import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  ViewEncapsulation,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SvgIconComponent } from '@ngneat/svg-icon';
import { TuiThemeColorService } from '@taiga-ui/cdk';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiNavigation } from '@taiga-ui/layout';
import { links } from './links';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  imports: [
    CommonModule,
    RouterModule,
    SvgIconComponent,
    TuiIcon,
    TuiButton,
    TuiNavigation,
  ],
  selector: 'bk-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MenuComponent {
  readonly #theme = inject(TuiThemeColorService);
  readonly #supabase = inject(SupabaseService);
  isLoginPage = input<boolean>(false);
  destroyRef = inject(DestroyRef);
  router = inject(Router);
  isDrawerOpen = false;
  links = links;
  drawerToggle = viewChild<ElementRef<HTMLLabelElement>>('drawerToggle');

  get userId() {
    return this.#supabase.logged;
  }

  constructor() {
    this.#theme.color = '#6c86e2';
  }

  linkClicked() {
    this.drawerToggle()?.nativeElement.click();
  }

  logout() {
    this.#supabase.logout();
    this.drawerToggle()?.nativeElement.click();
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
}
