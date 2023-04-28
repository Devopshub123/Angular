import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeExcelUploadComponent } from './employee-excel-upload.component';

describe('EmployeeExcelUploadComponent', () => {
  let component: EmployeeExcelUploadComponent;
  let fixture: ComponentFixture<EmployeeExcelUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeExcelUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeExcelUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
