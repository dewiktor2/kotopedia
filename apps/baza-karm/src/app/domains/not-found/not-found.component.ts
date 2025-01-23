import { Component, inject, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  template: `
    <div
      class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800"
    >
      <h1 class="text-9xl font-extrabold tracking-widest text-gray-900">404</h1>
      <div
        class="bg-blue-500 px-2 text-sm text-white rounded rotate-12 absolute"
      >
        Strona nie znaleziona
      </div>
      <p class="mt-4 text-xl text-gray-600">
        Strona, której szukasz nie istnieje lub została przeniesiona
      </p>
      <a
        routerLink="/"
        class="mt-6 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition"
      >
        Strona główna
      </a>
    </div>
  `,
})
export class NotFoundComponent implements OnInit {
  #metaService = inject(Meta);

  ngOnInit(): void {
    this.#metaService.updateTag({
      name: 'robots',
      content: 'noindex, nofollow',
    });
    this.#metaService.updateTag({
      name: 'description',
      content: 'Kotopedia - Strona, której szukasz nie istnieje lub została przeniesiona',
    });
  }
}
