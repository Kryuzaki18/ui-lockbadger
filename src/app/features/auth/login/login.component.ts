import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Store } from '@ngrx/store';
import * as AuthActions from '../../../store/auth/auth.actions';
import { selectAuthError, selectIsAuthenticated, selectIsLoading } from '../../../store/auth/auth.selectors';

import { LucideMail, LucideLock, LucideEye, LucideEyeOff, LucideLogIn } from '@lucide/angular';

import { NzAlertComponent } from 'ng-zorro-antd/alert';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { NzInputDirective, NzInputPrefixDirective, NzInputSuffixDirective, NzInputWrapperComponent } from 'ng-zorro-antd/input';

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
    NzAlertComponent,
    NzButtonComponent,
    NzCheckboxComponent,
    NzInputDirective,
    NzInputPrefixDirective,
    NzInputSuffixDirective,
    NzInputWrapperComponent,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading$ = this.store.select(selectIsLoading);
  readonly error$ = this.store.select(selectAuthError);

  showPassword = false;

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  get emailControl() { return this.form.get('email'); }
  get passwordControl() { return this.form.get('password'); }

  ngOnInit(): void {
    this.store
      .select(selectIsAuthenticated)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((authenticated) => {
        if (authenticated) this.router.navigate(['/home']);
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch(AuthActions.clearAuthError());
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password, rememberMe } = this.form.value;
    this.store.dispatch(AuthActions.login({ email, password, rememberMe }));
  }
}
