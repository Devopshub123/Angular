import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusePopupComponent } from './reuse-popup.component';

describe('ReusePopupComponent', () => {
  let component: ReusePopupComponent;
  let fixture: ComponentFixture<ReusePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReusePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReusePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
