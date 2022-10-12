import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrDocumentApprovalComponent } from './hr-document-approval.component';

describe('HrDocumentApprovalComponent', () => {
  let component: HrDocumentApprovalComponent;
  let fixture: ComponentFixture<HrDocumentApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrDocumentApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HrDocumentApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
