import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { provideDataAccess } from '@data-access/provide-data-access';
import { CropAssistantPage } from './crop-assistant.page';

describe('CropAssistantPage', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [CropAssistantPage],
      providers: [provideRouter([]), provideHttpClient(), provideDataAccess()],
    });
  });

  it('advances through five steps and persists progress', () => {
    const fixture = TestBed.createComponent(CropAssistantPage);
    const page = fixture.componentInstance;
    fixture.detectChanges();

    expect(page.state.step).toBe(1);
    page.pickCrop('crop-tomato');
    expect(page.state.step).toBe(2);
    page.pickStage('crop-tomato-vegetative');
    expect(page.state.step).toBe(3);
    page.pickSymptom('sy-yellow');
    expect(page.state.step).toBe(4);
    page.finish();
    expect(page.state.step).toBe(5);
    page.back();
    expect(page.state.step).toBe(4);

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.cropAssistant) ?? '{}') as {
      cropId: string;
      step: number;
    };
    expect(stored.cropId).toBe('crop-tomato');
    expect(stored.step).toBe(4);
  });
});
