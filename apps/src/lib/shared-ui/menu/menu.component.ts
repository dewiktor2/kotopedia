import { CommonModule, DOCUMENT, NgOptimizedImage } from '@angular/common';
import { Component, ViewEncapsulation, Inject, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
    imports: [CommonModule, RouterModule, NgOptimizedImage],
    selector: 'k-shared-menu',
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class SharedMenuComponent {
  // Property to track if the drawer is open
  isDrawerOpen = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public router: Router
  ) {}

  toggleTheme() {
    const body = this.document.body;
    const currentTheme = body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      this.renderer.setAttribute(body, 'data-theme', 'light');
    } else {
      this.renderer.setAttribute(body, 'data-theme', 'dark');
    }
  }

  // Method to toggle the drawer's state
  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
}
