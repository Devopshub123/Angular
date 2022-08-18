import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmMessageMasterComponent } from './lm-message-master.component';

describe('LmMessageMasterComponent', () => {
  let component: LmMessageMasterComponent;
  let fixture: ComponentFixture<LmMessageMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LmMessageMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LmMessageMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
