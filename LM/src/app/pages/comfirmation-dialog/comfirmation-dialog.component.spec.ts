import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComfirmationDialogComponent } from './comfirmation-dialog.component';

describe('ComfirmationDialogComponent', () => {
  let component: ComfirmationDialogComponent;
  let fixture: ComponentFixture<ComfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
