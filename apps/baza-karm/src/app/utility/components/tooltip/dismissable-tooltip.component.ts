import { Component, Input, ViewChild, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'bk-dismissable-tooltip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <dialog id="modal-feed-{{ identifier }}" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">{{ label }}</h3>
        <div class="py-4 text-left">
          <ul *ngIf="!!splittedText?.length; else noData">
            <li *ngFor="let item of splittedText">{{ item }}</li>
          </ul>
          <ng-template #noData> Brak danych </ng-template>
        </div>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn">Zamknij</button>
          </form>
        </div>
      </div>
    </dialog>
  `,
  styles: ``,
})
export class DismissableTooltipComponent {
  @Input()
  text!: string;

  @Input()
  label!: string;

  @Input()
  identifier!: string;

  @Input()
  isVisible = false;

  splittedText: string[] = [];

  private readonly document = inject(DOCUMENT);

  showModal(text?: string) {
    if (!text && !this.text) {
      (
        this?.document?.getElementById(`modal-feed-${this.identifier}`) as any
      )?.showModal();
      return;
    }
    if (text) {
      this.splittedText = text.split(', ');
    } else {
      this.splittedText = this.text.split(', ');
    }
    (
      this?.document?.getElementById(`modal-feed-${this.identifier}`) as any
    )?.showModal();
  }
}
