import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private auth: AuthService) {}

  getCompanyProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/public/company`);
  }

  submitInquiry(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/public/inquiry`, payload);
  }

  login(payload: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, payload);
  }

  getAnalyticsSummary(): Observable<any> {
    const token = this.auth.token;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.get(`${this.baseUrl}/analytics/summary`, { headers });
  }

  getAnalyticsFilters(): Observable<any> {
    const token = this.auth.token;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.get(`${this.baseUrl}/analytics/filters`, { headers });
  }

  getInquiries(): Observable<any> {
    const token = this.auth.token;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.get(`${this.baseUrl}/admin/inquiries`, { headers });
  }

  updateInquiryStatus(id: string, status: string): Observable<any> {
    const token = this.auth.token;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.patch(`${this.baseUrl}/admin/inquiries/${id}`, { status }, { headers });
  }
}
