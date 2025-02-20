import {
  AfterViewInit,
  Component,
  ElementRef,
  output,
  viewChild,
} from '@angular/core';
import { environment } from '../../../env/environment';

// TODO add types
declare const hcaptcha: any;

@Component({
  selector: 'bk-captcha',
  template: ` <div #hcaptchaContainer class="hcaptcha-container"></div> `,
})
export class HCaptchaComponent implements AfterViewInit {
  #hcaptchaSiteKey = 'f6488658-34a8-4c6e-a480-357c500ad01c';
  #hcaptchaToken: string | null = null;
  #widgetId: number | null = null;

  hcaptchaContainer = viewChild<ElementRef>('hcaptchaContainer');
  captchaEntered = output<void>();

  get token() {
    return this.#hcaptchaToken;
  }

  ngAfterViewInit(): void {
    const isApiReady = typeof hcaptcha !== 'undefined';
    if (isApiReady) {
      this.renderHCaptcha();
    } else {
      (window as any).onHCaptchaLoad = () => this.renderHCaptcha();
    }
  }

  renderHCaptcha(): void {
    if (!this.hcaptchaContainer) {
      console.error('HCaptcha container element not found');
      return;
    }

    this.renderWidget();
  }

  resetCaptcha() {
    hcaptcha.reset(this.#widgetId);
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
    if (token) {
      this.captchaEntered.emit();
    }
    console.log('hCaptcha token:', token);
  }

  private handleHCaptchaExpired(): void {
    this.#hcaptchaToken = null;
    this.resetCaptcha();
    console.warn(
      'hCaptcha token expired, please complete the challenge again.',
    );
  }
}
