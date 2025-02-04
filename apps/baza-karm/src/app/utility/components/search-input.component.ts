import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { Subject, debounceTime, distinctUntilChanged, of } from 'rxjs';
import { FeedsState } from '../../domains/feed/+state/feed.state';

@Component({
  selector: 'bk-search-input',
  imports: [AsyncPipe, NgOptimizedImage],
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
          @if ( (searchInProgress$ | async) === false) {
          <img
            ngSrc="assets/svg/search.svg"
            class="w-6 h-6 opacity-70"
            width="24"
            height="24"
            alt="Search Icon"
            (click)="onSearchButtonClick(searchInput.value)"
          />
          } @else {
          <span class="loading loading-ring loading-xs"></span>
          }
        </label>
        <div
          class="flex ml-2 tooltip tooltip-left"
          data-tip="Szukaj po nazwie lub firmie"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 cursor-pointer text-blue-500"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
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
        takeUntilDestroyed(this.#destroyRef)
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
