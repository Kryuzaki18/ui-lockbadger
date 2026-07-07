import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import {
  LucideMail,
  LucideLock,
  LucideEye,
  LucideEyeOff,
  LucideLogIn,
  LucideShieldCheck,
} from '@lucide/angular';

import * as AuthActions from '../../../store/auth/auth.actions';
import {
  selectAuthError,
  selectIsAuthenticated,
  selectIsLoading,
} from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AsyncPipe,
    LucideMail,
    LucideLock,
    LucideEye,
    LucideEyeOff,
    LucideLogIn,
    LucideShieldCheck,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  readonly isLoading$ = this.store.select(selectIsLoading);
  readonly error$ = this.store.select(selectAuthError);

  showPassword = false;

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  ngOnInit(): void {
    this.store
      .select(selectIsAuthenticated)
      .pipe(takeUntil(this.destroy$))
      .subscribe((authenticated) => {
        if (authenticated) {
          this.router.navigate(['/home']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(AuthActions.clearAuthError());
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password, rememberMe } = this.form.value;
    this.store.dispatch(AuthActions.login({ email, password, rememberMe }));
  }

  get emailControl() { return this.form.get('email'); }
  get passwordControl() { return this.form.get('password'); }
}
