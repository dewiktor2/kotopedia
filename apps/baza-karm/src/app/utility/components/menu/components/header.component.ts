import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { SvgIconComponent } from '@ngneat/svg-icon';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiNavigation } from '@taiga-ui/layout';

@Component({
  selector: 'bk-menu-header',
  imports: [SvgIconComponent, TuiIcon, TuiButton, TuiNavigation],
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
      {{ userId() ? userId() : '' }}
    </span>
  </header>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  userId = input.required<string>();
  drawerToggle = viewChild<ElementRef<HTMLLabelElement>>('drawerToggle');

  closeDrawer() {
    this.drawerToggle()?.nativeElement.click();
  }
}
