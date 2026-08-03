import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';

import { VaultComponent } from './vault.component';
import { VAULT_FEATURE_KEY, vaultReducer } from '../../store/vault/vault.reducer';
import { AUTH_FEATURE_KEY, authReducer } from '../../store/auth/auth.reducer';

describe('VaultComponent', () => {
  let component: VaultComponent;
  let fixture: ComponentFixture<VaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VaultComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideStore({ [VAULT_FEATURE_KEY]: vaultReducer, [AUTH_FEATURE_KEY]: authReducer }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VaultComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
