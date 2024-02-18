import { CommonModule, DOCUMENT } from '@angular/common';
import {
  Component,
  ViewEncapsulation,
  OnInit,
  HostListener,
  Inject,
} from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'k-shared-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SharedMenuComponent {
  // Property to track if the drawer is open
  isDrawerOpen = false;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  toggleTheme() {
    const body = this.document.body;
    const currentTheme = body.getAttribute('data-theme');
    body.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
  }

  // Method to toggle the drawer's state
  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
}
