import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ReturnFilters, ReturnsPage } from '../models/returns.models';

@Injectable() export class ReturnsApiService {
  private readonly http = inject(HttpClient);
  list(filters: ReturnFilters): Observable<ReturnsPage> { let params = new HttpParams(); Object.entries(filters).forEach(([key, value]) => { if (value !== '') params = params.set(key, String(value)); }); return this.http.get<ReturnsPage>(`${environment.apiBaseUrl}/admin/returns`, { params }); }
  report(filters: ReturnFilters): Observable<Blob> { const params = new HttpParams({ fromObject: { search: filters.search, status: filters.status, refund_method: filters.refundMethod, period: filters.period } }); return this.http.get(`${environment.apiBaseUrl}/admin/returns/export`, { params, responseType: 'blob' }); }
}
