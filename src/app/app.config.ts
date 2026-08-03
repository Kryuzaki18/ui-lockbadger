import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

import { routes } from './app.routes';
import { AppTitleStrategy } from './core/strategy/app-title.strategy';
import { AuthInterceptor } from './core/interceptors/auth.interceptors';

import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as authEffects from './store/auth/auth.effects';
import { AUTH_FEATURE_KEY, authReducer } from './store/auth/auth.reducer';
import * as vaultEffects from './store/vault/vault.effects';
import { VAULT_FEATURE_KEY, vaultReducer } from './store/vault/vault.reducer';

import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    { provide: TitleStrategy, useClass: AppTitleStrategy },
    provideStore({
      [AUTH_FEATURE_KEY]: authReducer,
      [VAULT_FEATURE_KEY]: vaultReducer,
    }),
    provideEffects(authEffects, vaultEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
    provideNzI18n(en_US),
  ],
};
