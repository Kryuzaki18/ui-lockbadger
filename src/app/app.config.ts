import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as authEffects from './store/auth/auth.effects';
import { AUTH_FEATURE_KEY, authReducer } from './store/auth/auth.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore({
      [AUTH_FEATURE_KEY]: authReducer,
    }),
    provideEffects(authEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
  ]
};
