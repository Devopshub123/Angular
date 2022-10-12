import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureDocumentsComponent } from './configure-documents.component';

describe('ConfigureDocumentsComponent', () => {
  let component: ConfigureDocumentsComponent;
  let fixture: ComponentFixture<ConfigureDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
