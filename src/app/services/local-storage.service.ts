import { Injectable } from '@angular/core';

type LocalStorageKey = 'ollamaContext' | 'playerStats'

@Injectable({
  providedIn: 'root'
})

export class LocalStorageService {

  constructor() { }

  hasLocalStorage(): boolean {
    if (localStorage.getItem('player_stats') || localStorage.getItem('ollamaContext')) {
      return true
    }
    return false
  }

  hasLocalStorageItem(key: LocalStorageKey): boolean {
    if (localStorage.getItem(key)) {
      return true
    }
    return false
  }

  clearLocalStorage() {
    const context = this.getFromLocalStorage('ollamaContext');
    const char = this.getFromLocalStorage('playerStats');
    if (context.length || char.length) {
      localStorage.clear();
      location.reload();
    }
  }

  getFromLocalStorage(key: LocalStorageKey) {
    const item = localStorage.getItem(key);
    return this.parseLocalStorageItem(item)
  }

  setLocalStorageItem(key: LocalStorageKey, item: unknown) {
    const localStorageItem = JSON.stringify(item)
    localStorage.setItem(key, localStorageItem)
  }

  private parseLocalStorageItem(item: string | null) {
    return item ? JSON.parse(item) : [];
  }
}
