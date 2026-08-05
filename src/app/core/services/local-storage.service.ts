import { EnvironmentInjector, Injectable, inject, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private localStorageSignal = new Map<string, ReturnType<typeof signal>>();

  private readonly environmentInjector = inject(EnvironmentInjector);

  getLocalStorageSignal<T>(key: string, defaultValue: T) {
    if (!this.localStorageSignal.has(key)) {
      const initial = this.getLocalStorageItem<T>(key, defaultValue);
      const s = signal<T>(initial);

      effect(
        () => {
          this.setLocalStorageItem(key, s());
        },
        { injector: this.environmentInjector, manualCleanup: true },
      );

      this.localStorageSignal.set(key, s);
    }

    return this.localStorageSignal.get(key)! as ReturnType<typeof signal<T>>;
  }

  updateLocalStorageSignal<T>(key: string, value: T): void {
    const s = this.localStorageSignal.get(key);
    if (s) {
      s.set(value);
    } else {
      console.warn(`Signal for key "${key}" not found.`);
    }
  }

  removeLocalStorageSignal(key: string): void {
    const s = this.localStorageSignal.get(key);
    if (s) {
      this.localStorageSignal.delete(key);
    }
    this.removeLocalStorageItem(key);
  }

  getLocalStorageItem<T>(key: string, defaultValue: T): T {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? (JSON.parse(storedValue) as T) : defaultValue;
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}"`, error);
      return defaultValue;
    }
  }

  setLocalStorageItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving localStorage key "${key}"`, error);
    }
  }

  removeLocalStorageItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}"`, error);
    }
  }
}