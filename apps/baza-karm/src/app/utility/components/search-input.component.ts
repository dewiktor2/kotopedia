import { Component, EventEmitter, Output, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subject, debounceTime, distinctUntilChanged, of } from 'rxjs';
import { FeedsState } from '../../domains/feed/+state/feed.state';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bk-search-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="form-control pb-4 flex w-72">
      <div class="place-items-center flex">
        <label class="input input-bordered flex w-72 items-center gap-2">
          <input
            [readonly]="searchInProgress$ | async"
            #searchInput
            type="search"
            class="grow"
            placeholder="Szukaj"
            (keydown.enter)="onSearchButtonClick(searchInput.value)"
          />
          <svg
            *ngIf="!(searchInProgress$ | async); else other"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="w-6 h-6 opacity-70"
            (click)="onSearchButtonClick(searchInput.value)"
          >
            <path
              fill-rule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clip-rule="evenodd"
            />
          </svg>
          <ng-template #other>
            <span class="loading loading-ring loading-xs"></span>
          </ng-template>
        </label>
        <!-- Information Icon with Tooltip -->
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
export class SearchInputComponent {
  @Output() searchText = new EventEmitter<string>();
  private searchSubject = new Subject<string>();

  private readonly store = inject(Store);

  searchInProgress$ = of(false);

  ngOnInit() {
    this.searchInProgress$ = this.store.select(FeedsState.searchInProgress);
    this.searchSubject
      .pipe(
        debounceTime(500), // Wait for 500ms of silence before emitting the last value
        distinctUntilChanged() // Only emit if the current value is different from the last
      )
      .subscribe((value) => this.searchText.emit(value));
  }

  ngOnDestroy() {
    this.searchSubject.unsubscribe();
  }

  onSearchButtonClick(value: string): void {
    this.searchSubject.next(value);
  }
}
