import { Component, inject, input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { raw } from 'express';

@Component({
  selector: 'bk-dismissable-tooltip',
  template: `
    <dialog id="modal-feed-{{ identifier() }}" class="modal">
      <div
        class="modal-box w-full max-w-screen-sm md:max-w-screen-md
                   max-h-[80vh] overflow-y-auto"
      >
        <span class="font-bold text-lg">{{ label() }}</span>
        <div class="py-4 text-left text-sm md:text-base">
          @if (!!splittedText.length) {
          <ul class="list-disc list-inside space-y-1">
            @for (item of splittedText; track item) {
            <li>{{ item }}</li>
            }
          </ul>
          } @else { Brak danych }
        </div>
        <div class="modal-action">
          <form method="dialog">
            <button
              class="btn text-white bg-blue-300   hover:bg-blue-500
                  focus:bg-blue-500   
                  active:bg-blue-600  px-4 py-2 rounded"
            >
              Zamknij
            </button>
          </form>
        </div>
      </div>
    </dialog>
  `,
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
    // 1. Ustal źródłowy tekst (ten z parametru lub z inputu).
    const rawText = text || this.text();

    const splitted = this.splitOutsideParentheses(rawText);

    this.splittedText = splitted;
  }

  /**
   * Dzieli tekst po przecinkach znajdujących się TYLKO poza nawiasami.
   * Nawiasy mogą być zagnieżdżone; liczymy pary '(' i ')'.
   *
   * @param input Tekst wejściowy
   * @returns Tablica fragmentów
   */
  private splitOutsideParentheses(input: string): string[] {
    const results: string[] = [];
    let buffer = '';
    let parenthesesCount = 0;

    for (const char of input) {
      if (char === '(') {
        parenthesesCount++;
        buffer += char;
      } else if (char === ')') {
        parenthesesCount = Math.max(0, parenthesesCount - 1);
        buffer += char;
      }
      // Jeśli trafimy na przecinek, a nie jesteśmy w nawiasach, to dzielimy
      else if (char === ',' && parenthesesCount === 0) {
        results.push(buffer.trim());
        buffer = '';
      } else {
        buffer += char;
      }
    }

    // Dodaj ostatni zbuforowany fragment (o ile nie jest pusty)
    if (buffer.trim().length > 0) {
      results.push(buffer.trim());
    }

    return results;
  }

  private showModalFeed() {
    return (
      this.#document?.getElementById(`modal-feed-${this.identifier()}`) as any
    )?.showModal();
  }
}
