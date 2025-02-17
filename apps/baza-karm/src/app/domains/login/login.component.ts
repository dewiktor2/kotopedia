import { Component, DestroyRef, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiButton, TuiError, TuiIcon } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/legacy';
import { catchError, of, tap } from 'rxjs';
import { SupabaseService } from '../../services/supabase.service';
import { HCaptchaComponent } from './hcCaptcha.component';
import { LoginForm } from './model/login.model';

@Component({
  imports: [
    TuiInputModule,
    ReactiveFormsModule,
    TuiButton,
    HCaptchaComponent,
    TuiError,
    TuiIcon,
  ],
  templateUrl: './login.component.html',
  styles: [
    `
      .login-page {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #526ed3;
      }

      .login-container {
        background: rgba(255, 255, 255, 0.9);
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        width: 350px;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .icon-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 16px;
        }
      }

      h1 {
        text-align: center;
        margin-bottom: 1rem;
      }

      button[tuiButton] {
        width: 100%;
      }
    `,
  ],
})
export class LoginComponent {
  readonly #supabase = inject(SupabaseService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #router = inject(Router);

  captcha = viewChild<HCaptchaComponent>('captcha');
  loginForm = new LoginForm();

  onSubmit(): void {
    if (this.loginForm.valid && this.captcha()?.token) {
      this.login();
    } else {
      console.error('Form is invalid or hCaptcha not completed');
    }
  }

  private login() {
    this.#supabase
      .login({
        ...this.loginForm.getRawValue(),
        options: {
          captchaToken: this.captcha()?.token ?? '',
        },
      })
      .pipe(
        tap(() => this.#router.navigateByUrl('/')),
        catchError(() => {
          this.captcha()?.resetCaptcha();
          return of(null);
        }),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe();
  }
}
