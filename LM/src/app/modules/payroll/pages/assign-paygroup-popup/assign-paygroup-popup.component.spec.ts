import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPaygroupPopupComponent } from './assign-paygroup-popup.component';

describe('AssignPaygroupPopupComponent', () => {
  let component: AssignPaygroupPopupComponent;
  let fixture: ComponentFixture<AssignPaygroupPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignPaygroupPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPaygroupPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
