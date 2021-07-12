import { TestBed } from '@angular/core/testing';

import { ToastMessageService } from './toast-message.service';

describe('ToastMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToastMessageService = TestBed.get(ToastMessageService);
    expect(service).toBeTruthy();
  });
});
