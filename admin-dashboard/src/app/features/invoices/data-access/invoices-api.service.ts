import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Invoice, InvoicePage, InvoiceQuery } from '../models/invoice.models';

@Injectable()
export class InvoicesApiService {
  private readonly http = inject(HttpClient);
  list(query: InvoiceQuery): Observable<InvoicePage> {
    const params = new HttpParams({ fromObject: {
      search: query.search, payment_status: query.paymentStatus, branch_id: query.branchId, date_from: query.dateFrom, date_to: query.dateTo,
      sort: query.sort, direction: query.direction, page: query.page, per_page: query.perPage,
    }});
    return this.http.get<InvoicePage>(`${environment.apiBaseUrl}/admin/invoices`, { params });
  }
  details(id: string): Observable<Invoice> { return this.http.get<Invoice>(`${environment.apiBaseUrl}/admin/invoices/${encodeURIComponent(id)}`); }
  report(query: InvoiceQuery): Observable<Blob> { return this.http.get(`${environment.apiBaseUrl}/admin/invoices/export`, { params: new HttpParams({ fromObject: { search: query.search, payment_status: query.paymentStatus, branch_id: query.branchId, date_from: query.dateFrom, date_to: query.dateTo } }), responseType: 'blob' }); }
}
