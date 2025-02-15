import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SvgIconComponent } from '@ngneat/svg-icon';
import { TuiThemeColorService } from '@taiga-ui/cdk';
import { TuiIcon } from '@taiga-ui/core';
import { TuiNavigation } from '@taiga-ui/layout';
import { links } from './links';

@Component({
  imports: [
    CommonModule,
    RouterModule,
    SvgIconComponent,
    TuiIcon,
    TuiNavigation,
  ],
  selector: 'bk-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MenuComponent {
  readonly #theme = inject(TuiThemeColorService);
  isDrawerOpen = false;
  links = links;

  router = inject(Router);

  constructor() {
    this.#theme.color = '#6c86e2'
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
}
