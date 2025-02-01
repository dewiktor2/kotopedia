import {
  Component,
  DestroyRef,
  Inject,
  OnInit,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { SharedMenuComponent } from '@projekty/shared-ui';
import { filter, tap } from 'rxjs';
import { CULTURE_HANDLER, SEO_HANDLER } from '@baza-karm/tokens';

@Component({
  imports: [RouterOutlet, SharedMenuComponent],
  selector: 'bk-root',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
  template: `
    <main class="max-h-full md:max-h-screen flex flex-col overflow-hidden">
      <k-shared-menu />

      <div class="mt-2 px-8 pb-8 flex-1 overflow-auto">
        <router-outlet />
      </div>
    </main>
  `,
})
export class AppComponent implements OnInit {
  title = 'baza-karm';
  showMenu = signal(true);

  #destroyRef = inject(DestroyRef);
  readonly #swUpdate = inject(SwUpdate);

  constructor(
    @Inject(CULTURE_HANDLER) private cultureHandler: () => void,
    @Inject(SEO_HANDLER) private seoHandler: () => void
  ) {
    this.cultureHandler();
    this.seoHandler();
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
        tap(() => this.reloadPage())
      )
      .subscribe();
  }

  reloadPage() {
    window.location.reload();
  }
}
