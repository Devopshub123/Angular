import { TestBed, async, inject } from '@angular/core/testing';

import { LMSAccessGuard } from './LMS-access.guard';

describe('LMSAccessGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LMSAccessGuard]
    });
  });

  it('should ...', inject([LMSAccessGuard], (guard: LMSAccessGuard) => {
    expect(guard).toBeTruthy();
  }));
});
