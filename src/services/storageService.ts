import { SavedGame } from '../types/game';

export interface StorageAdapter {
  saveGame(game: SavedGame): Promise<void>;
  loadGame(): Promise<SavedGame | null>;
  clearGame(): Promise<void>;
}

const STORAGE_KEY = 'kenya_budget_sim_v1';

export class LocalStorageAdapter implements StorageAdapter {
  async saveGame(game: SavedGame): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
    } catch (e) {
      console.error('Failed to save game to LocalStorage:', e);
    }
  }

  async loadGame(): Promise<SavedGame | null> {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data) as SavedGame;
    } catch (e) {
      console.error('Failed to load game from LocalStorage:', e);
      return null;
    }
  }

  async clearGame(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear game from LocalStorage:', e);
    }
  }
}

// Future remote backend / database adapter stub
export class RemoteApiAdapter implements StorageAdapter {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/budget-game') {
    this.baseUrl = baseUrl;
  }

  async saveGame(game: SavedGame): Promise<void> {
    const response = await fetch(`${this.baseUrl}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(game)
    });
    if (!response.ok) {
      throw new Error(`Remote save failed: ${response.statusText}`);
    }
  }

  async loadGame(): Promise<SavedGame | null> {
    const response = await fetch(`${this.baseUrl}/load`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Remote load failed: ${response.statusText}`);
    }
    return response.json();
  }

  async clearGame(): Promise<void> {
    await fetch(`${this.baseUrl}/clear`, { method: 'DELETE' });
  }
}

// Active storage singleton (swappable adapter)
export const storage: StorageAdapter = new LocalStorageAdapter();
