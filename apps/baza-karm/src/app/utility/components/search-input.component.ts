import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'bk-search-input',
  standalone: true,
  imports: [],
  template: `
    <div class="form-control pb-4 flex">
      <input
        type="search"
        placeholder="Szukaj"
        class="input input-bordered input-primary"
        #searchInput
        (keydown.enter)="onSearchButtonClick(searchInput.value)"
      />
      <button
        class="btn btn-primary ml-2"
        (click)="onSearchButtonClick(searchInput.value)"
      >
        Szukaj
      </button>
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
      input {
        width: 100%; /* Makes the input field take up all available space */
        max-width: 400px; /* Optionally, set a maximum width to prevent it from getting too wide */
      }
    `,
  ],
})
export class SearchInputComponent {
  @Output() searchText = new EventEmitter<string>();

  onSearchButtonClick(value: string): void {
    this.searchText.emit(value);
  }
}
