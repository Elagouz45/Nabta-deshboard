import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { ApiError, User } from '@core/models';
import { provideDataAccess } from '@data-access/provide-data-access';
import { AccountRepository } from '@data-access/repositories/account.repository';

describe('MockAccountRepository demo persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideDataAccess()],
    });
  });

  it('rejects a duplicate mobile with an Arabic field error', async () => {
    const repo = TestBed.inject(AccountRepository);
    try {
      await firstValueFrom(
        repo.register({ fullName: 'مستخدم مكرر', mobile: '01000000001', password: 'Namaa@123' }),
      );
      throw new Error('expected duplicate mobile to fail');
    } catch (err) {
      const error = err as ApiError;
      expect(error.fieldErrors?.['mobile']).toContain('مسجّل');
    }
  });

  it('persists a registered user so the same password works after a later login', async () => {
    const repo = TestBed.inject(AccountRepository);
    const registered = await firstValueFrom(
      repo.register({
        fullName: 'مزارع جديد',
        mobile: '01555550001',
        email: 'new.farmer@example.com',
        password: 'Namaa@123',
      }),
    );
    expect(registered.user.mobile).toBe('01555550001');
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.demoUsers) ?? '[]') as User[];
    expect(users.some((user) => user.mobile === '01555550001')).toBe(true);

    const session = await firstValueFrom(repo.login('01555550001', 'Namaa@123'));
    expect(session.user.fullName).toBe('مزارع جديد');
  });
});
