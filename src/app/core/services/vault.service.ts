import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { API_ROUTES } from '../constants/api-routes.constant';
import { VaultEntry, VaultEntryInput } from '../types/vault.model';

import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class VaultService {
  private readonly http = inject(HttpService);

  list(): Observable<VaultEntry[]> {
    return this.http.get<VaultEntry[]>(`${environment.apiUrl}${API_ROUTES.vault.root}`);
  }

  create(input: VaultEntryInput): Observable<VaultEntry> {
    return this.http.post<VaultEntry>(`${environment.apiUrl}${API_ROUTES.vault.root}`, input);
  }

  update(id: string, input: Partial<VaultEntryInput>): Observable<VaultEntry> {
    return this.http.patch<VaultEntry>(`${environment.apiUrl}${API_ROUTES.vault.byId(id)}`, input);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}${API_ROUTES.vault.byId(id)}`);
  }
}
