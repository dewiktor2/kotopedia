import { Component, inject, input } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'bk-dismissable-tooltip',
    template: `
    <dialog id="modal-feed-{{ identifier() }}" class="modal">
      <div class="modal-box">
        <span class="font-bold text-lg">{{ label() }}</span>
        <div class="py-4 text-left">
          @if (!!splittedText.length) {
            <ul>
              @for (item of splittedText; track item) {
                <li>{{ item }}</li>
              }
            </ul>
          }
          @else {
            Brak danych 
          }
        </div>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn text-white bg-blue-300 hover:bg-blue-500">Zamknij</button>
          </form>
        </div>
      </div>
    </dialog>
  `
})
export class DismissableTooltipComponent {

  text = input.required<string>();
  identifier = input.required<string>();
  label = input<string>();
  isVisible = input<boolean>(false);

  splittedText: string[] = [];

  readonly #document = inject(DOCUMENT);

  public showModal(text?: string): void {
    if (!text && !this.text()) {
      this.showModalFeed();
      return;
    }
    this.splitText(text as string);
    this.showModalFeed();
  }

  private splitText(text: string) {
    if (text) {
      this.splittedText = text.split(', ');
    } else {
      this.splittedText = this.text().split(', ');
    }
  }

  private showModalFeed() {
    return (this.#document?.getElementById(`modal-feed-${this.identifier()}`) as any)?.showModal();
  }

}
