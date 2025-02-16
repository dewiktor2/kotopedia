import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SvgIconComponent } from '@ngneat/svg-icon';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiNavigation } from '@taiga-ui/layout';

@Component({
  selector: 'bk-menu-header',
  imports: [SvgIconComponent, RouterLink, TuiIcon, TuiButton, TuiBadge, TuiNavigation],
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
      <tui-icon icon="@tui.cat" />
      <span id="menu-title" tuiFade class="tui-text_body-m-2"
        >Baza karm dla kotów</span
      >
    </div>
    <button
      appearance="accent"
      iconStart="@tui.calculator"
      tuiButton
      type="button"
    >
      <a [style.color]="'white'" [href]="'https://kalkulator.kotopedia.pl'"
        >Kalkulator</a
      >
    </button>
    <hr />
    <span class="bk-sm-hidden">
      @if (userId()) {
        <tui-badge appearance="positive" tuiStatus>
          {{ userId() }}
        </tui-badge>
      } @else {
        <a
          class="mb-2"
          iconStart="@tui.user"
          [style.color]="'white'"
          [routerLink]="'/login'"
        >
          Zaloguj się
        </a>
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

  closeDrawer() {
    this.drawerToggle()?.nativeElement.click();
  }
}
