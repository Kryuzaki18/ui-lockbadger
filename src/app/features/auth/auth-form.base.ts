import { Directive, inject, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth/auth.actions';
import { selectAuthError, selectIsLoading } from '../../store/auth/auth.selectors';

@Directive()
export abstract class AuthFormBase implements OnDestroy {
  protected readonly store = inject(Store);

  readonly isLoading$ = this.store.select(selectIsLoading);
  readonly error$ = this.store.select(selectAuthError);

  ngOnDestroy(): void {
    this.store.dispatch(AuthActions.clearAuthError());
  }
}
