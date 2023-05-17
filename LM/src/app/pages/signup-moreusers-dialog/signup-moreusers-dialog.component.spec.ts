import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupMoreusersDialogComponent } from './signup-moreusers-dialog.component';

describe('SignupMoreusersDialogComponent', () => {
  let component: SignupMoreusersDialogComponent;
  let fixture: ComponentFixture<SignupMoreusersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupMoreusersDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupMoreusersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
