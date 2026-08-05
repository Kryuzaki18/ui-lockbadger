import { createReducer, on } from '@ngrx/store';
import { VaultState } from '../../core/types/vault.model';
import * as VaultActions from './vault.actions';

export const VAULT_FEATURE_KEY = 'vault';

export const initialVaultState: VaultState = {
  entries: [],
  isLoading: false,
  isSaving: false,
  deletingId: null,
  error: null,
};

export const vaultReducer = createReducer(
  initialVaultState,

  on(VaultActions.loadVaultEntries, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(VaultActions.loadVaultEntriesSuccess, (state, { entries }) => ({
    ...state,
    entries,
    isLoading: false,
  })),

  on(VaultActions.loadVaultEntriesFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(VaultActions.addVaultEntry, (state) => ({
    ...state,
    isSaving: true,
    error: null,
  })),

  on(VaultActions.addVaultEntrySuccess, (state, { entry }) => ({
    ...state,
    entries: [entry, ...state.entries],
    isSaving: false,
  })),

  on(VaultActions.addVaultEntryFailure, (state, { error }) => ({
    ...state,
    isSaving: false,
    error,
  })),

  on(VaultActions.updateVaultEntry, (state) => ({
    ...state,
    isSaving: true,
    error: null,
  })),

  on(VaultActions.updateVaultEntrySuccess, (state, { entry }) => ({
    ...state,
    entries: state.entries.map((e) => (e.id === entry.id ? entry : e)),
    isSaving: false,
  })),

  on(VaultActions.updateVaultEntryFailure, (state, { error }) => ({
    ...state,
    isSaving: false,
    error,
  })),

  on(VaultActions.deleteVaultEntry, (state, { id }) => ({
    ...state,
    deletingId: id,
    error: null,
  })),

  on(VaultActions.deleteVaultEntrySuccess, (state, { id }) => ({
    ...state,
    entries: state.entries.filter((e) => e.id !== id),
    deletingId: null,
  })),

  on(VaultActions.deleteVaultEntryFailure, (state, { error }) => ({
    ...state,
    deletingId: null,
    error,
  })),

  on(VaultActions.clearVaultError, (state) => ({
    ...state,
    error: null,
  })),
);
