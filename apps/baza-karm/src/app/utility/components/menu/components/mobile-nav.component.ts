import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TuiBadge } from '@taiga-ui/kit';
import { SupabaseService } from '../../../../services/supabase.service';
import { links } from '../links';

@Component({
  selector: 'bk-mobile-drawer',
  imports: [TuiBadge, RouterModule],
  template: ` <div class="drawer">
    <input type="checkbox" id="my-drawer" class="drawer-toggle" />
    <div class="drawer-side w-100" [style.z-index]="101">
      <label for="my-drawer" class="drawer-overlay"></label>

      <div
        class="menu p-4 overflow-y-auto mt-16 lg:mt-0"
        [style.background]="'#1b1f3b'"
      >
        <span [style.color]="'white'">Karmy</span>

        <ul class="mt-2" [style.width]="'20rem'">
          <li>
            <ul class="pl-4">
              @for (link of links.mobile; track link.route) {
                <li class="pb-1">
                  <a
                    [style.color]="'white'"
                    (click)="linkClicked()"
                    [routerLink]="[link.route]"
                    [class.active-link]="router.url === link.route"
                    >{{ link.name }}</a
                  >
                </li>
              }
            </ul>
          </li>
          <li>
            <a
              [style.color]="'white'"
              [href]="'https://kalkulator.kotopedia.pl'"
              [target]="'_blank'"
              >Kalkulator karmy</a
            >
          </li>

          @if (!userId()) {
            <li>
              <a
                class="mb-2"
                (click)="linkClicked()"
                iconStart="@tui.user"
                [class.active-link]="router.url === '/login'"
                [style.color]="'white'"
                [routerLink]="'/login'"
              >
                Zaloguj się
              </a>
            </li>
          } @else {
            <li>
              <a
                class="mb-2"
                (click)="logout()"
                iconStart="@tui.log-out"
                [style.color]="'white'"
              >
                Wyloguj się
              </a>
            </li>
          }

          @if (userId()) {
            <tui-badge
              [style.background]="'white'"
              appearance="positive"
              tuiStatus
            >
              {{ userId() }}
            </tui-badge>
          }
        </ul>
      </div>
    </div>
  </div>`,
  styles: [
    `
      .active-link {
        background-color: rgb(59, 130, 246);
        color: white;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileDrawerComponent {
  readonly #supabase = inject(SupabaseService);
  readonly #cdr = inject(ChangeDetectorRef);
  router = inject(Router);
  userId = input.required<string>();
  links = links;

  handleDrawerClose = output();

  linkClicked() {
    this.closeDrawer();
  }

  logout() {
    this.#supabase.logout();
    this.closeDrawer();
  }

  private closeDrawer() {
    this.handleDrawerClose.emit();
    this.#cdr.detectChanges();
  }
}
