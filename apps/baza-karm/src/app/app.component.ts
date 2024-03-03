import { Component, ViewEncapsulation, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { SharedMenuComponent } from '@projekty/shared-ui';
import { tap } from 'rxjs';
import { CultureService } from './services/culture.service';
import { SeoService } from './services/seo.service';


@Component({
  standalone: true,
  imports: [RouterModule, SharedMenuComponent],
  selector: 'bk-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'baza-karm';

  private readonly swUpdate = inject(SwUpdate);
  private readonly seoService = inject(SeoService);

  constructor(private readonly cultureService: CultureService) {
    // The culture will be set when the service is instantiated
  }

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(
          tap((event: VersionEvent) => {
            if (event.type === 'VERSION_READY') {
              this.reloadPage();
            }
          })
        )
        .subscribe();
    }
  }

  reloadPage() {
    window.location.reload();
  }
}
