import { AfterViewInit, Component, ElementRef, viewChild } from '@angular/core';
import { environment } from '../../../env/environment';

declare const hcaptcha: any; // Declare hcaptcha as any since it's loaded globall

@Component({
  selector: 'bk-captcha',
  standalone: true,
  template: ` <div #hcaptchaContainer class="hcaptcha-container"></div> `,
})
export class HCaptchaComponent implements AfterViewInit {
  #hcaptchaSiteKey = 'f6488658-34a8-4c6e-a480-357c500ad01c';
  #hcaptchaToken: string | null = null;
  #widgetId: number | null = null;

  hcaptchaContainer = viewChild<ElementRef>('hcaptchaContainer');

  get token() {
    return this.#hcaptchaToken;
  }

  ngAfterViewInit(): void {
    // Wait until the hCaptcha API is available
    const isApiReady = typeof hcaptcha !== 'undefined';
    if (isApiReady) {
      this.renderHCaptcha();
    } else {
      (window as any).onHCaptchaLoad = () => {
        this.renderHCaptcha();
      };
    }
  }

  renderHCaptcha(): void {
    if (!this.hcaptchaContainer) {
      console.error('HCaptcha container element not found');
      return;
    }

    this.renderWidget();
  }

  private renderWidget() {
    this.#widgetId = hcaptcha.render(this.hcaptchaContainer()?.nativeElement, {
      sitekey: this.#hcaptchaSiteKey,
      secret: environment.hCaptchaSecret,
      size: 'normal',
      callback: (token: string) => this.handleHCaptchaResponse(token),
      'expired-callback': () => this.handleHCaptchaExpired(),
    });
  }

  private handleHCaptchaResponse(token: string): void {
    this.#hcaptchaToken = token;
    console.log('hCaptcha token:', token);
  }

  private handleHCaptchaExpired(): void {
    this.#hcaptchaToken = null;
    console.warn(
      'hCaptcha token expired, please complete the challenge again.',
    );
  }
}
