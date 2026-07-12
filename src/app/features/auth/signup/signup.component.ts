import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { LucideMail, LucideLock, LucideEye, LucideEyeOff, LucideKeyRound, LucideUserPlus, LucideShieldCheck } from '@lucide/angular';

import * as AuthActions from '../../../store/auth/auth.actions';
import { selectAuthError, selectIsLoading } from '../../../store/auth/auth.selectors';

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
})
export class SignupComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  readonly isLoading$ = this.store.select(selectIsLoading);
  readonly error$ = this.store.select(selectAuthError);

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

  ngOnDestroy(): void {
    this.store.dispatch(AuthActions.clearAuthError());
  }

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
