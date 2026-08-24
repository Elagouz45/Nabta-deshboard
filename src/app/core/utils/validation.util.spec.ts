import { isEgyptianMobile, passwordStrength } from './validation.util';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  egyptianMobileValidator,
  emailValidator,
  matchControlValidator,
  passwordStrengthValidator,
} from '@shared/validators/namaa.validators';

describe('validation', () => {
  it('accepts Egyptian mobiles', () => {
    expect(isEgyptianMobile('01000000001')).toBe(true);
    expect(isEgyptianMobile('01112345678')).toBe(true);
    expect(isEgyptianMobile('01212345678')).toBe(true);
    expect(isEgyptianMobile('01512345678')).toBe(true);
    expect(isEgyptianMobile('0123456789')).toBe(false);
    expect(isEgyptianMobile('01312345678')).toBe(false);
    expect(isEgyptianMobile('01,12345678')).toBe(false);
  });

  it('normalizes Arabic digits and spaces in Egyptian mobiles', () => {
    expect(isEgyptianMobile('٠١٠١٢٣٤٥٦٧٨')).toBe(true);
    expect(isEgyptianMobile('۰۱۵۱۲۳۴۵۶۷۸')).toBe(true);
    expect(isEgyptianMobile('010 1234 5678')).toBe(true);
    expect(egyptianMobileValidator()(new FormControl('٠١١١٢٣٤٥٦٧٨'))).toBeNull();
  });

  it('enforces password strength', () => {
    expect(passwordStrength('Namaa@123')).toBe(true);
    expect(passwordStrength('Namaa123')).toBe(true);
    expect(passwordStrength('weak')).toBe(false);
    expect(passwordStrength('Namaa1')).toBe(false);
    expect(passwordStrength('namaa123')).toBe(false);
    expect(passwordStrength('NAMAA123')).toBe(false);
    expect(passwordStrength('NamaaAgri')).toBe(false);
    expect(passwordStrengthValidator()(new FormControl('123456'))).toEqual({ passwordStrength: true });
  });

  it('validates login-style controls', () => {
    expect(egyptianMobileValidator()(new FormControl('01000000001'))).toBeNull();
    expect(egyptianMobileValidator()(new FormControl('123'))).toEqual({ egyptianMobile: true });
    expect(passwordStrengthValidator()(new FormControl('Namaa@123'))).toBeNull();
  });

  it('matches password confirmation', () => {
    const group = new FormGroup({
      password: new FormControl('Namaa@123'),
      confirm: new FormControl('Namaa@123', [matchControlValidator('password')]),
    });
    group.controls.confirm.updateValueAndValidity();
    expect(group.controls.confirm.errors).toBeNull();
    group.controls.confirm.setValue('other');
    expect(group.controls.confirm.errors).toEqual({ mismatch: true });
    group.controls.confirm.setValue('Namaa@123');
    group.controls.password.setValue('Namaa@456');
    group.controls.confirm.updateValueAndValidity();
    expect(group.controls.confirm.errors).toEqual({ mismatch: true });
  });

  it('validates checkout contact and terms fields', () => {
    expect(egyptianMobileValidator()(new FormControl('01000000001'))).toBeNull();
    expect(emailValidator()(new FormControl('farmer@example.com'))).toBeNull();
    expect(emailValidator()(new FormControl('not-an-email'))).toEqual({ email: true });
    const terms = new FormControl(false, { validators: [Validators.requiredTrue] });
    expect(terms.invalid).toBe(true);
    terms.setValue(true);
    expect(terms.valid).toBe(true);
  });
});
