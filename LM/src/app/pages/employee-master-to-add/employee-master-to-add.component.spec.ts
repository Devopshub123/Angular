import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMasterToAddComponent } from './employee-master-to-add.component';

describe('EmployeeMasterToAddComponent', () => {
  let component: EmployeeMasterToAddComponent;
  let fixture: ComponentFixture<EmployeeMasterToAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeMasterToAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeMasterToAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
