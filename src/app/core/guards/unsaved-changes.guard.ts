import { CanDeactivateFn } from '@angular/router';

export interface DirtyComponent {
  isDirty(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<DirtyComponent> = (component) => {
  if (!component.isDirty()) {
    return true;
  }
  return confirm('هناك تغييرات غير محفوظة. هل تريد المغادرة؟');
};
