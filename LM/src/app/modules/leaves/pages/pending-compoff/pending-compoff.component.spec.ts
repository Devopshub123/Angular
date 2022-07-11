import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingCompoffComponent } from './pending-compoff.component';

describe('PendingCompoffComponent', () => {
  let component: PendingCompoffComponent;
  let fixture: ComponentFixture<PendingCompoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingCompoffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingCompoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
