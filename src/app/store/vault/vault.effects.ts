import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { VaultService } from '../../core/services/vault.service';
import * as VaultActions from './vault.actions';

export const loadVaultEntriesEffect = createEffect(
  (actions$ = inject(Actions), vaultService = inject(VaultService)) =>
    actions$.pipe(
      ofType(VaultActions.loadVaultEntries),
      exhaustMap(() =>
        vaultService.list().pipe(
          map((entries) => VaultActions.loadVaultEntriesSuccess({ entries })),
          catchError((err) =>
            of(
              VaultActions.loadVaultEntriesFailure({
                error: err?.error?.message ?? 'Failed to load vault entries',
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const addVaultEntryEffect = createEffect(
  (actions$ = inject(Actions), vaultService = inject(VaultService)) =>
    actions$.pipe(
      ofType(VaultActions.addVaultEntry),
      exhaustMap(({ input }) =>
        vaultService.create(input).pipe(
          map((entry) => VaultActions.addVaultEntrySuccess({ entry })),
          catchError((err) =>
            of(
              VaultActions.addVaultEntryFailure({
                error: err?.error?.message ?? 'Failed to save password',
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);
