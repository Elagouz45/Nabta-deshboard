import { Pipe, PipeTransform, inject } from '@angular/core';
import { LocaleService } from '@core/i18n/locale.service';

@Pipe({ name: 'loc', standalone: true })
export class LocPipe implements PipeTransform {
  private readonly locale = inject(LocaleService);

  transform(ar: string, en: string): string {
    return this.locale.text(ar, en);
  }
}

@Pipe({ name: 'money', standalone: true })
export class MoneyPipe implements PipeTransform {
  private readonly locale = inject(LocaleService);

  transform(value: number | null | undefined): string {
    const amount = Number(value ?? 0).toLocaleString(this.locale.localeTag(), {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return `${amount} ${this.locale.t('common.egp')}`;
  }
}

@Pipe({ name: 't', standalone: true })
export class TranslatePipe implements PipeTransform {
  private readonly locale = inject(LocaleService);

  transform(key: string): string {
    return this.locale.t(key);
  }
}
