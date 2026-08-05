import { createAction, props } from '@ngrx/store';
import { VaultEntry, VaultEntryInput } from '../../core/types/vault.model';

export const loadVaultEntries = createAction('[Vault] Load Entries');
export const loadVaultEntriesSuccess = createAction(
  '[Vault] Load Entries Success',
  props<{ entries: VaultEntry[] }>(),
);
export const loadVaultEntriesFailure = createAction(
  '[Vault] Load Entries Failure',
  props<{ error: string }>(),
);

export const addVaultEntry = createAction('[Vault] Add Entry', props<{ input: VaultEntryInput }>());
export const addVaultEntrySuccess = createAction(
  '[Vault] Add Entry Success',
  props<{ entry: VaultEntry }>(),
);
export const addVaultEntryFailure = createAction(
  '[Vault] Add Entry Failure',
  props<{ error: string }>(),
);

export const updateVaultEntry = createAction(
  '[Vault] Update Entry',
  props<{ id: string; input: Partial<VaultEntryInput> }>(),
);
export const updateVaultEntrySuccess = createAction(
  '[Vault] Update Entry Success',
  props<{ entry: VaultEntry }>(),
);
export const updateVaultEntryFailure = createAction(
  '[Vault] Update Entry Failure',
  props<{ error: string }>(),
);

export const deleteVaultEntry = createAction('[Vault] Delete Entry', props<{ id: string }>());
export const deleteVaultEntrySuccess = createAction(
  '[Vault] Delete Entry Success',
  props<{ id: string }>(),
);
export const deleteVaultEntryFailure = createAction(
  '[Vault] Delete Entry Failure',
  props<{ id: string; error: string }>(),
);

export const clearVaultError = createAction('[Vault] Clear Error');
