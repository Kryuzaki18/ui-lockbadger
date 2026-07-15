import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';

import { routes } from './app.routes';
import { AppTitleStrategy } from './strategy/app-title.strategy';

import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as authEffects from './store/auth/auth.effects';
import { AUTH_FEATURE_KEY, authReducer } from './store/auth/auth.reducer';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: TitleStrategy, useClass: AppTitleStrategy },
    provideStore({
      [AUTH_FEATURE_KEY]: authReducer,
    }),
    provideEffects(authEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
    provideNzI18n(en_US),
  ],
};
