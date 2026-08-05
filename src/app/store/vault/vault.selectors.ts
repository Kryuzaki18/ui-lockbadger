import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VAULT_FEATURE_KEY } from './vault.reducer';
import { VaultState } from '../../core/types/vault.model';

export const selectVaultState = createFeatureSelector<VaultState>(VAULT_FEATURE_KEY);

export const selectVaultEntries = createSelector(selectVaultState, (state) => state.entries);
export const selectVaultLoading = createSelector(selectVaultState, (state) => state.isLoading);
export const selectVaultSaving = createSelector(selectVaultState, (state) => state.isSaving);
export const selectVaultDeletingId = createSelector(selectVaultState, (state) => state.deletingId);
export const selectVaultError = createSelector(selectVaultState, (state) => state.error);
