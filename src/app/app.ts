import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { STORAGE } from './core/constants/storage.constant';
import { LocalStorageService } from './core/services/local-storage.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly localStorageService = inject(LocalStorageService);

  private readonly theme = this.localStorageService.getLocalStorageSignal<'light' | 'dark'>(
    STORAGE.theme,
    'dark',
  );

  constructor() {
    effect(() => {
      const isDark = this.theme() === 'dark';
      document.documentElement.classList.toggle('dark', isDark);
      document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    });
  }
}
