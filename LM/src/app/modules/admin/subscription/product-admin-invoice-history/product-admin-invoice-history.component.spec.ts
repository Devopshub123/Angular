import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAdminInvoiceHistoryComponent } from './product-admin-invoice-history.component';

describe('ProductAdminInvoiceHistoryComponent', () => {
  let component: ProductAdminInvoiceHistoryComponent;
  let fixture: ComponentFixture<ProductAdminInvoiceHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductAdminInvoiceHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAdminInvoiceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
