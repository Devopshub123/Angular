import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceUploadexcelComponent } from './attendance-uploadexcel.component';

describe('AttendanceUploadexcelComponent', () => {
  let component: AttendanceUploadexcelComponent;
  let fixture: ComponentFixture<AttendanceUploadexcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceUploadexcelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceUploadexcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
