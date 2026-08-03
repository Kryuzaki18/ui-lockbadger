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
}
