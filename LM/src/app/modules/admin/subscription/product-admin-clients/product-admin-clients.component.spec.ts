import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAdminClientsComponent } from './product-admin-clients.component';

describe('ProductAdminClientsComponent', () => {
  let component: ProductAdminClientsComponent;
  let fixture: ComponentFixture<ProductAdminClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductAdminClientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAdminClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
