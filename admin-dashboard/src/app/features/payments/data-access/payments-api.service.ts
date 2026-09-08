import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaymentFilters, PaymentPage } from '../models/payment.models';
@Injectable()
export class PaymentsApiService{private readonly http=inject(HttpClient);list(filters:PaymentFilters):Observable<PaymentPage>{return this.http.get<PaymentPage>(`${environment.apiBaseUrl}/admin/payments`,{params:new HttpParams({fromObject:{search:filters.search,status:filters.status,method:filters.method,period:filters.period,page:filters.page,per_page:filters.perPage}})});}report(filters:PaymentFilters):Observable<Blob>{return this.http.get(`${environment.apiBaseUrl}/admin/payments/export`,{params:new HttpParams({fromObject:{search:filters.search,status:filters.status,method:filters.method,period:filters.period}}),responseType:'blob'});}}
