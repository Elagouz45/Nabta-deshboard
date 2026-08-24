import { Injectable, inject } from '@angular/core';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { Order, User } from '@core/models';
import { StorageService } from '@core/services/storage.service';

/**
 * Demo / mock credential record.
 * Client-side PBKDF2 is NOT production authentication. A real backend must hash and verify passwords.
 */
export interface DemoCredential {
  salt: string;
  hash: string;
  iterations: number;
}

const PBKDF2_ITERATIONS = 100_000;
const HASH_BITS = 256;

@Injectable({ providedIn: 'root' })
export class DemoAuthStorage {
  private readonly storage = inject(StorageService);

  loadUsers(): User[] {
    return this.storage.get<User[]>(STORAGE_KEYS.demoUsers) ?? [];
  }

  saveUsers(users: User[]): void {
    this.storage.set(STORAGE_KEYS.demoUsers, users);
  }

  loadOrders(): Order[] {
    return this.storage.get<Order[]>(STORAGE_KEYS.demoOrders) ?? [];
  }

  saveOrders(orders: Order[]): void {
    this.storage.set(STORAGE_KEYS.demoOrders, orders);
  }

  loadCredentials(): Record<string, DemoCredential> {
    return this.storage.get<Record<string, DemoCredential>>(STORAGE_KEYS.demoCredentials) ?? {};
  }

  saveCredentials(records: Record<string, DemoCredential>): void {
    this.storage.set(STORAGE_KEYS.demoCredentials, records);
  }

  credential(mobile: string): DemoCredential | null {
    return this.loadCredentials()[mobile] ?? null;
  }

  async setPassword(mobile: string, password: string): Promise<void> {
    const next = { ...this.loadCredentials(), [mobile]: await this.hashPassword(password) };
    this.saveCredentials(next);
  }

  async verifyPassword(mobile: string, password: string, fallbackPlain?: string): Promise<boolean> {
    const stored = this.credential(mobile);
    if (stored) {
      return this.matches(password, stored);
    }
    if (fallbackPlain !== undefined && fallbackPlain === password) {
      await this.setPassword(mobile, password);
      return true;
    }
    return false;
  }

  /**
   * PBKDF2-SHA-256 via Web Crypto. Demo-only — never log the password or derived bits.
   */
  async hashPassword(password: string, saltBytes?: Uint8Array): Promise<DemoCredential> {
    const cryptoRef = globalThis.crypto;
    if (!cryptoRef?.subtle) {
      throw new Error('Web Crypto is required for demo password hashing.');
    }
    const salt = saltBytes ?? cryptoRef.getRandomValues(new Uint8Array(16));
    const material = await cryptoRef.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, [
      'deriveBits',
    ]);
    const bits = await cryptoRef.subtle.deriveBits(
      { name: 'PBKDF2', hash: 'SHA-256', salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS },
      material,
      HASH_BITS,
    );
    return {
      salt: bytesToBase64(salt),
      hash: bytesToBase64(new Uint8Array(bits)),
      iterations: PBKDF2_ITERATIONS,
    };
  }

  private async matches(password: string, record: DemoCredential): Promise<boolean> {
    const computed = await this.hashPassword(password, base64ToBytes(record.salt));
    return computed.hash === record.hash && computed.iterations === record.iterations;
  }
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
