import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavepoliciesComponent } from './leavepolicies.component';

describe('LeavepoliciesComponent', () => {
  let component: LeavepoliciesComponent;
  let fixture: ComponentFixture<LeavepoliciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeavepoliciesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavepoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
