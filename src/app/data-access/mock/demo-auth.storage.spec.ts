import { TestBed } from '@angular/core/testing';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { DemoAuthStorage } from './demo-auth.storage';

describe('DemoAuthStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('hashes a password and verifies it without storing the raw secret', async () => {
    const demo = TestBed.inject(DemoAuthStorage);
    await demo.setPassword('01512345678', 'Namaa@123');
    expect(await demo.verifyPassword('01512345678', 'Namaa@123')).toBe(true);
    expect(await demo.verifyPassword('01512345678', 'WrongPass1')).toBe(false);
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.demoCredentials) ?? '{}') as Record<
      string,
      { salt: string; hash: string }
    >;
    expect(stored['01512345678'].salt).toBeTruthy();
    expect(stored['01512345678'].hash).toBeTruthy();
    expect(JSON.stringify(stored)).not.toContain('Namaa@123');
  });

  it('hashes a seed fallback password on first successful verify', async () => {
    const demo = TestBed.inject(DemoAuthStorage);
    expect(await demo.verifyPassword('01000000001', 'Namaa@123', 'Namaa@123')).toBe(true);
    expect(await demo.verifyPassword('01000000001', 'Namaa@123')).toBe(true);
    expect(localStorage.getItem(STORAGE_KEYS.demoCredentials)).toContain('01000000001');
  });
});
