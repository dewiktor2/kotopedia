import { Component, Input, ViewChild, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'bk-dismissable-tooltip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <dialog id="modal-feed-{{identifier}}" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Skład karmy</h3>
        <div class="py-4 text-left">
          <ul>
            <li *ngFor="let item of splittedText">{{ item }}</li>
          </ul>
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
  identifier!: string;

  @Input()
  isVisible = false;

  splittedText: string[] = [];

  private readonly document = inject(DOCUMENT);

  showModal() {
    this.splittedText = this.text.split(', ');
    (this?.document?.getElementById(`modal-feed-${this.identifier}`) as any)?.showModal();
  }
  
}
