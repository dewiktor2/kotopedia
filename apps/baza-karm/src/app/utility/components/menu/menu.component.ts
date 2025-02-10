import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SvgIconComponent } from '@ngneat/svg-icon';

@Component({
  imports: [CommonModule, RouterModule, NgOptimizedImage, SvgIconComponent],
  selector: 'bk-shared-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SharedMenuComponent {
  isDrawerOpen = false;

  router = inject(Router);

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
}
