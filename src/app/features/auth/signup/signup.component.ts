import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { LucideMail, LucideLock, LucideEye, LucideEyeOff, LucideKeyRound, LucideUserPlus, LucideShieldCheck } from '@lucide/angular';

import { AuthFormBase } from '../auth-form.base';
import * as AuthActions from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AsyncPipe,
    LucideMail,
    LucideLock,
    LucideEye,
    LucideEyeOff,
    LucideKeyRound,
    LucideUserPlus,
    LucideShieldCheck,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent extends AuthFormBase {
  private readonly fb = inject(FormBuilder);

  showPassword = false;
  showConfirm = false;

  form: FormGroup = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordsMatch },
  );

  private passwordsMatch(group: FormGroup) {
    const pw = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pw === confirm ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.value;
    this.store.dispatch(AuthActions.signup({ email, password }));
  }

  get emailControl() { return this.form.get('email'); }
  get passwordControl() { return this.form.get('password'); }
  get confirmControl() { return this.form.get('confirmPassword'); }
}
