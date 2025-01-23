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
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { SharedMenuComponent } from '@projekty/shared-ui';
import { AdsenseModule } from 'ng2-adsense';
import { filter, tap } from 'rxjs';
import { CULTURE_HANDLER } from './tokens/culture.token';
import { SEO_HANDLER } from './tokens/seo.token';

@Component({
  imports: [RouterOutlet, SharedMenuComponent, AdsenseModule],
  selector: 'bk-root',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="max-h-full md:max-h-screen flex flex-col overflow-hidden">
      @if (showMenu()) {   
        @defer {
          <k-shared-menu />
          <div class="pt-10 px-8 pb-8 flex-1 overflow-auto">
            <router-outlet />
            <!-- Main content area -->
            <!-- <ng-adsense
                [adClient]="'ca-pub-4829562881799420'"
                [display]="'inline-block'"
                [width]="320"
                [height]="108"
              /> -->
          </div>
        } 
      } 
      @else {
        <router-outlet />
      }
    </div>
  `,
})
export class AppComponent implements OnInit {
  title = 'baza-karm';
  showMenu = signal(true);

  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
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
    this.#router.events
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        // Hide the shared menu if on the 'not-found' route
        this.showMenu.set(event.url !== '/not-found');
      });
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
