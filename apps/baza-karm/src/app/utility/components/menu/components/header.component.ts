import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { SvgIconComponent } from '@ngneat/svg-icon';
import { TuiButton, TuiLink } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiNavigation } from '@taiga-ui/layout';

@Component({
  selector: 'bk-menu-header',
  imports: [
    SvgIconComponent,
    TuiButton,
    TuiLink,
    TuiBadge,
    TuiNavigation,
  ],
  template: ` <header tuiNavigationHeader>
    <div tuiNavigationLogo>
      <label
        #drawerToggle
        data-drawer-hide="my-drawer"
        for="my-drawer"
        class="btn btn-square btn-ghost lg:hidden"
      >
        <svg-icon key="hamburger" />
      </label>

      <button
        (click)="homePage()"
        [style.color]="'white'"
        iconEnd="@tui.cat"
        tuiLink
        type="button"
      >
        Baza karm dla kotów
      </button>
      <div class="bk-sm-hidden">
        <button
          appearance="primary"
          iconStart="@tui.calculator"
          tuiButton
          type="button"
        >
          <a
            [style.color]="'white'"
            [href]="'https://kalkulator.kotopedia.pl'"
            target="_blank"
            >Kalkulator karmy</a
          >
        </button>
      </div>
    </div>

    <hr />
    <span class="bk-sm-hidden">
      @if (userId()) {
        <tui-badge appearance="positive" tuiStatus>
          {{ userId() }}
        </tui-badge>
      } @else {
        <button
          appearance="primary"
          (click)="loginPage()"
          [style.color]="'white'"
          iconStart="@tui.user"
          tuiButton
          type="button"
        >
          Zaloguj się
        </button>
      }
    </span>
  </header>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      header[tuiNavigationHeader][tuiNavigationHeader]tui-badge {
        max-inline-size: 20rem !important;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  userId = input.required<string>();
  drawerToggle = viewChild<ElementRef<HTMLLabelElement>>('drawerToggle');
  router = inject(Router);

  closeDrawer() {
    this.drawerToggle()?.nativeElement.click();
  }

  homePage() {
    this.router.navigateByUrl('/');
  }

  loginPage() {
    this.router.navigateByUrl('/login');
  }
}
