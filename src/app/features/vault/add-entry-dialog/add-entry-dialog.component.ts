import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, takeUntil } from 'rxjs';
import {
  LucideEye,
  LucideEyeOff,
  LucideGlobe,
  LucideKeyRound,
  LucideRefreshCw,
  LucideUser,
} from '@lucide/angular';
import { NzAlertComponent } from 'ng-zorro-antd/alert';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import {
  NzInputDirective,
  NzInputPrefixDirective,
  NzInputSuffixDirective,
  NzInputWrapperComponent,
} from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalComponent, NzModalContentDirective, NzModalService } from 'ng-zorro-antd/modal';
import { NzProgressComponent } from 'ng-zorro-antd/progress';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';

import * as VaultActions from '../../../store/vault/vault.actions';
import { selectVaultError, selectVaultSaving } from '../../../store/vault/vault.selectors';
import { computePasswordStrength } from '../../../core/utils/vault.util';
import { VAULT_CATEGORIES, VaultCategory, VaultEntry, VaultPasswordStrength } from '../../../core/types/vault.model';

const STRENGTH_META: Record<VaultPasswordStrength, { label: string; percent: number; strokeColor: string }> = {
  weak: { label: 'Weak', percent: 33, strokeColor: '#ef4444' },
  fair: { label: 'Fair', percent: 66, strokeColor: '#f59e0b' },
  strong: { label: 'Strong', percent: 100, strokeColor: '#10b981' },
};

const PASSWORD_CHARSET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';

@Component({
  selector: 'app-add-entry-dialog',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    LucideEye,
    LucideEyeOff,
    LucideGlobe,
    LucideKeyRound,
    LucideRefreshCw,
    LucideUser,
    NzAlertComponent,
    NzButtonComponent,
    NzInputDirective,
    NzInputPrefixDirective,
    NzInputSuffixDirective,
    NzInputWrapperComponent,
    NzModalComponent,
    NzModalContentDirective,
    NzOptionComponent,
    NzProgressComponent,
    NzSelectComponent,
  ],
  providers: [NzModalService],
  templateUrl: './add-entry-dialog.component.html',
})
export class AddEntryDialogComponent implements OnChanges, OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly message = inject(NzMessageService);
  private readonly destroy$ = new Subject<void>();

  @Input() open = false;
  @Input() entry: VaultEntry | null = null;
  @Output() closeDialog = new EventEmitter<void>();

  readonly categories = VAULT_CATEGORIES;
  readonly isSaving$ = this.store.select(selectVaultSaving);
  readonly error$ = this.store.select(selectVaultError);

  showPassword = false;

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    category: ['Logins' as VaultCategory, Validators.required],
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(1)]],
    url: [''],
    notes: [''],
  });

  get isEditMode(): boolean {
    return !!this.entry;
  }

  ngOnInit(): void {
    this.actions$
      .pipe(ofType(VaultActions.addVaultEntrySuccess), takeUntil(this.destroy$))
      .subscribe(() => {
        this.message.success('Password saved to your vault.');
        this.resetForm();
        this.closeDialog.emit();
      });

    this.actions$
      .pipe(ofType(VaultActions.updateVaultEntrySuccess), takeUntil(this.destroy$))
      .subscribe(() => {
        this.message.success('Password updated.');
        this.resetForm();
        this.closeDialog.emit();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.resetForm();
      this.store.dispatch(VaultActions.clearVaultError());
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get titleControl() { return this.form.get('title'); }
  get usernameControl() { return this.form.get('username'); }
  get passwordControl() { return this.form.get('password'); }

  get strengthMeta() {
    return STRENGTH_META[computePasswordStrength(this.passwordControl?.value ?? '')];
  }

  generatePassword(): void {
    const randomValues = new Uint32Array(20);
    crypto.getRandomValues(randomValues);
    const generated = Array.from(randomValues, (value) => PASSWORD_CHARSET[value % PASSWORD_CHARSET.length]).join('');
    this.form.patchValue({ password: generated });
    this.showPassword = true;
  }

  onCancel(): void {
    this.closeDialog.emit();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { title, category, username, password, url, notes } = this.form.value;
    const input = {
      title,
      category,
      username,
      password,
      url: url?.trim() ? url.trim() : undefined,
      notes: notes?.trim() ? notes.trim() : undefined,
    };

    if (this.entry) {
      this.store.dispatch(VaultActions.updateVaultEntry({ id: this.entry.id, input }));
    } else {
      this.store.dispatch(VaultActions.addVaultEntry({ input }));
    }
  }

  private resetForm(): void {
    this.form.reset({
      title: this.entry?.title ?? '',
      category: this.entry?.category ?? 'Logins',
      username: this.entry?.username ?? '',
      password: this.entry?.password ?? '',
      url: this.entry?.url ?? '',
      notes: this.entry?.notes ?? '',
    });
    this.showPassword = false;
  }
}
