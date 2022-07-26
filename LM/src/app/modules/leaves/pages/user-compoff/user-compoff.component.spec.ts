import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCompoffComponent } from './user-compoff.component';

describe('UserCompoffComponent', () => {
  let component: UserCompoffComponent;
  let fixture: ComponentFixture<UserCompoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCompoffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCompoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
