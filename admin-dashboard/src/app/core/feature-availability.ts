import { computed } from '@angular/core';
import { environment } from '../../environments/environment';
import { AdminFeature } from '../../environments/environment.model';

export class FeatureAvailability {
  readonly verified = computed(() => new Set<AdminFeature>(environment.verifiedFeatures));
  readonly demoMode = computed(() => environment.demoAdmin !== null && !environment.production);

  isAvailable(feature: AdminFeature): boolean {
    return this.demoMode() || this.verified().has(feature);
  }
}
