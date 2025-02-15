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
          } @else {
            Brak danych
          }
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
    const rawText = text || this.text();
    const splitted = this.splitNatural(rawText);

    this.splittedText = splitted;
  }

  /**
   * Sprawdza, czy dany znak jest cyfrą.
   * @param char - pojedynczy znak
   * @returns true, jeśli znak jest cyfrą, false w przeciwnym wypadku.
   */
  private isDigit(char: string): boolean {
    return /\d/.test(char);
  }

  /**
   * Dzieli napis na fragmenty wg. przecinków, ale nie dzieli, gdy przecinek występuje między dwiema cyframi.
   *
   * Przykłady:
   * - "jabłko, banan, gruszka"         -> ["jabłko", "banan", "gruszka"]
   * - "Waga: 1,5 kg, Cena: 10,99 zł"     -> ["Waga: 1,5 kg", "Cena: 10,99 zł"]
   *
   * @param input - Napis do podziału.
   * @returns Tablica stringów.
   */
  private splitNatural(input: string): string[] {
    const result: string[] = [];
    let buffer = '';
    let parenDepth = 0; // licznik głębokości nawiasów

    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      // Jeśli trafimy na nawias otwierający, zwiększamy głębokość i dodajemy znak do bufora.
      if (char === '(') {
        parenDepth++;
        buffer += char;
        continue;
      }

      // Jeśli trafimy na nawias zamykający, zmniejszamy głębokość i dodajemy znak.
      if (char === ')') {
        parenDepth = Math.max(0, parenDepth - 1);
        buffer += char;
        continue;
      }

      // Gdy znak to przecinek
      if (char === ',') {
        // Jeśli jesteśmy wewnątrz nawiasów, nie dzielimy – dodajemy przecinek do bufora.
        if (parenDepth > 0) {
          buffer += char;
        } else {
          // Pobieramy poprzedni i następny znak (jeśli istnieją)
          const prevChar = i > 0 ? input[i - 1] : '';
          const nextChar = i < input.length - 1 ? input[i + 1] : '';

          // Jeśli przecinek jest między cyframi (np. "1,5"), traktujemy go jako część liczby.
          if (this.isDigit(prevChar) && this.isDigit(nextChar)) {
            buffer += char;
          } else {
            // W przeciwnym wypadku traktujemy przecinek jako separator.
            result.push(buffer.trim());
            buffer = '';
          }
        }
        continue;
      }

      // Inne znaki dodajemy do bufora.
      buffer += char;
    }

    // Dodajemy ostatni fragment, jeśli zawiera jakieś treści.
    if (buffer.trim() !== '') {
      result.push(buffer.trim());
    }

    return result;
  }

  private showModalFeed() {
    return (
      this.#document?.getElementById(`modal-feed-${this.identifier()}`) as any
    )?.showModal();
  }
}
