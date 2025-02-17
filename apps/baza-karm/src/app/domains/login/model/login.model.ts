import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiValidationError } from '@taiga-ui/cdk';

export class LoginForm extends FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
}> {
  protected requiredError = new TuiValidationError('Pole wymagane');
  protected emailError = new TuiValidationError(
    'Wymagany poprawny adres e-mail',
  );
  constructor() {
    super({
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  get email() {
    return this.controls.email;
  }

  get password() {
    return this.controls.password;
  }

  invalidControl(property: keyof { email: string; password: string }) {
    const control = this.controls[property];

    const hasError = control.invalid && control.dirty;

    if (!hasError) {
      return null;
    }

    const errors: Record<'required' | 'email', TuiValidationError> = {
      email: this.emailError,
      required: this.requiredError,
    };

    return errors[control.hasError('required') ? 'required' : 'email'];
  }
}
