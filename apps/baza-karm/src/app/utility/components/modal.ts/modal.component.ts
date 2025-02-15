import { DOCUMENT } from '@angular/common';
import { Component, inject, input } from '@angular/core';

@Component({
  selector: 'bk-base-modal',
  template: `
    <dialog id="modal-base-{{ identifier() }}" class="modal">
      <div
        class="modal-box w-full max-w-screen-sm md:max-w-screen-md
                   max-h-[80vh] overflow-y-auto"
      >
        <span class="font-bold text-lg">{{ label() }}</span>
        <div class="py-4 text-left text-sm md:text-base">
          <ng-content />
        </div>
        <div class="modal-action">
          @if (showDefaultButtons()) {
            <form method="dialog">
              <button
                class="btn text-white bg-blue-300   hover:bg-blue-500
                  focus:bg-blue-500   
                  active:bg-blue-600  px-4 py-2 rounded"
              >
                Zamknij
              </button>
            </form>
          }
        </div>
      </div>
    </dialog>
  `,
})
export class DismissableModalComponent {
  identifier = input.required<string>();
  label = input<string>();
  isVisible = input<boolean>(false);
  showDefaultButtons = input<boolean>(true);

  readonly #document = inject(DOCUMENT);

  public showModal(): void {
    this.showModalFeed();
  }

  public close() {
    return (
      this.#document?.getElementById(`modal-base-${this.identifier()}`) as any
    )?.close();
  }

  private showModalFeed() {
    return (
      this.#document?.getElementById(`modal-base-${this.identifier()}`) as any
    )?.showModal();
  }
}
