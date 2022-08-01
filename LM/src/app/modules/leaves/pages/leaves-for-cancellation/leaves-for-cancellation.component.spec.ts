import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesForCancellationComponent } from './leaves-for-cancellation.component';

describe('LeavesForCancellationComponent', () => {
  let component: LeavesForCancellationComponent;
  let fixture: ComponentFixture<LeavesForCancellationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeavesForCancellationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavesForCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
