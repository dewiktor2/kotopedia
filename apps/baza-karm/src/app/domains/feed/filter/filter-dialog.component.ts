import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'bk-filter-dialog',
  standalone: true,
  template: ` <div
      class="mb-2 tooltip tooltip-right"
      data-tip="Filtrowanie po dodatkowych kryteriach"
    >
      <div class="flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          (click)="showModal()"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 cursor-pointer text-blue-500 mb-2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 3.75h18m-16.5 4.5h15m-13.5 4.5h9m-7.5 4.5h3"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 7.5V5.25a2.25 2.25 0 1 1 4.5 0V7.5m-6 6V18a2.25 2.25 0 1 0 4.5 0v-4.5m3-1.5V10.5a2.25 2.25 0 1 1 4.5 0v1.5"
          />
        </svg>
        <p>Filtry</p>
      </div>
    </div>

    <dialog id="modal-feed-1" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Filtry</h3>
        <form>
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">Low Phosphorus</span>
              <input
                type="checkbox"
                class="checkbox"
                [(ngModel)]="filters.lowPhosphorus"
                name="lowPhosphorus"
              />
            </label>
          </div>
          <div class="modal-action">
            <button class="btn btn-primary" (click)="applyFilters()">
              Filtruj
            </button>
            <button class="btn" (click)="close()">Zamknij</button>
          </div>
        </form>
      </div>
    </dialog>`,
  imports: [CommonModule, FormsModule],
})
export class FilterDialogComponent {
  filters = {
    enabled: false,
    lowPhosphorus: false,
  };

  private readonly document = inject(DOCUMENT);

  @Output() filterApplied = new EventEmitter<any>();

  applyFilters() {
    this.filters.enabled = this.filters.lowPhosphorus; // Adjust based on your logic
    this.filterApplied.emit(this.filters);
  }

  showModal() {
    (this?.document?.getElementById(`modal-feed-1`) as any)?.showModal();
  }

  close() {
    (this?.document?.getElementById(`modal-feed-1`) as any)?.close();
  }
}
