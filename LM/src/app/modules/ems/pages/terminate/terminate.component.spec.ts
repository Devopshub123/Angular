import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminateComponent } from './terminate.component';

describe('TerminateComponent', () => {
  let component: TerminateComponent;
  let fixture: ComponentFixture<TerminateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
