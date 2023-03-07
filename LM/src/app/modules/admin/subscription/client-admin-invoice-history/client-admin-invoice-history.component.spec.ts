import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAdminInvoiceHistoryComponent } from './client-admin-invoice-history.component';

describe('ClientAdminInvoiceHistoryComponent', () => {
  let component: ClientAdminInvoiceHistoryComponent;
  let fixture: ComponentFixture<ClientAdminInvoiceHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientAdminInvoiceHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAdminInvoiceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
