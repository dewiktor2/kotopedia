import { CommonModule, DOCUMENT } from '@angular/common';
import {
  Component,
  ViewEncapsulation,
  OnInit,
  HostListener,
  Inject,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';


@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'k-shared-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SharedMenuComponent {
  // Property to track if the drawer is open
  isDrawerOpen = false;

  constructor(@Inject(DOCUMENT) private document: Document,  public router: Router) {}

  toggleTheme() {
    const body = this.document.body;
    const currentTheme = body.getAttribute('data-theme');
    body.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');

    // const isDarkMode = currentTheme === 'dark';
    // if (isDarkMode) {
    //   document.body.classList.add('dark');
    // } else {
    //   document.body.classList.remove('dark');
    // }
  }

  // Method to toggle the drawer's state
  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
}
