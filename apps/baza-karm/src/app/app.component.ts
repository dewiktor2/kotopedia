import {
  Component,
  DestroyRef,
  Inject,
  inject,
  OnInit,
  signal,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';
import { SwUpdate, VersionEvent } from '@angular/service-worker';

import { filter, tap } from 'rxjs';
import { CULTURE_HANDLER } from './tokens/culture.token';
import { SEO_HANDLER } from './tokens/seo.token';
import { MenuComponent } from './utility/components/menu/menu.component';

@Component({
  imports: [RouterOutlet, MenuComponent],
  selector: 'bk-root',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
  template: `
    <main class="max-h-full md:max-h-screen flex flex-col overflow-hidden">
      @defer {
        <bk-menu>
          <div [class]="containerClass">
            <router-outlet />
          </div>
        </bk-menu>
      }
    </main>
  `,
})
export class AppComponent implements OnInit {
  #destroyRef = inject(DestroyRef);
  readonly #swUpdate = inject(SwUpdate);
  readonly #loginUrl = '/login';

  title = 'baza-karm';
  showMenu = signal(true);
  router = inject(Router);

  constructor(
    @Inject(CULTURE_HANDLER) private cultureHandler: () => void,
    @Inject(SEO_HANDLER) private seoHandler: () => void,
  ) {
    this.cultureHandler();
    this.seoHandler();
  }

  get containerClass(): string {
    return this.router.url !== this.#loginUrl
      ? 'mt-2 px-10 pb-8 flex-1 overflow-auto'
      : '';
  }

  ngOnInit() {
    if (this.#swUpdate.isEnabled) {
      this.onVersionReady();
    }
  }

  private onVersionReady() {
    this.#swUpdate.versionUpdates
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        filter((event: VersionEvent) => event?.type === 'VERSION_READY'),
        tap(() => window.location.reload()),
      )
      .subscribe();
  }
}
