import { AsyncPipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { debounceTime, distinctUntilChanged, of, Subject } from 'rxjs';
import { FeedsState } from '../../domains/feed/+state/feed.state';
import { SvgIconComponent } from '@ngneat/svg-icon';

@Component({
  selector: 'bk-search-input',
  imports: [AsyncPipe, SvgIconComponent],
  template: `
    <div class="form-control mt-2 pb-4 flex w-72">
      <div class="place-items-center flex">
        <label class="input input-bordered flex w-72 items-center gap-2">
          <input
            [readonly]="(searchInProgress$ | async) || disabled()"
            #searchInput
            type="search"
            class="grow"
            placeholder="Szukaj"
            (keydown.enter)="onSearchButtonClick(searchInput.value)"
          />
          @if ((searchInProgress$ | async) === false) {
            <svg-icon
              key="search"
              aria-roledescription="Search Icon"
              size="xl"
              (click)="onSearchButtonClick(searchInput.value)"
            />
          } @else {
            <span class="loading loading-ring loading-xs"></span>
          }
        </label>
        <div
          class="flex ml-2 tooltip tooltip-left"
          title="Szukaj po nazwie lub firmie"
        >
          <svg-icon
            class="w-6 h-6 cursor-pointer text-blue-500"
            key="description"
            size="xl"
          />
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* Additional styles for flex layout */
      .form-control {
        display: flex;
        flex-direction: row;
        gap: 8px;
      }
    `,
  ],
})
export class SearchInputComponent implements OnInit, OnDestroy {
  readonly searchText = output<string>();
  disabled = input<boolean>(false);

  #searchSubject = new Subject<string>();
  readonly #store = inject(Store);
  #destroyRef = inject(DestroyRef);
  searchInProgress$ = of(false);

  ngOnInit() {
    this.searchInProgress$ = this.#store.select(FeedsState.searchInProgress);
    this.#searchSubject
      .pipe(
        debounceTime(500), // Wait for 500ms of silence before emitting the last value
        distinctUntilChanged(), // Only emit if the current value is different from the last
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe((value) => this.searchText.emit(value));
  }

  ngOnDestroy() {
    this.#searchSubject.unsubscribe();
  }

  onSearchButtonClick(value: string): void {
    this.#searchSubject.next(value);
  }
}
