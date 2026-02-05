import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  inquiries: any[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.fetchInquiries();
  }

  fetchInquiries(): void {
    this.loading = true;
    this.error = '';
    this.api.getInquiries().subscribe({
      next: (res) => {
        this.inquiries = res.inquiries || [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.error || 'Unable to load inquiries.';
      }
    });
  }

  updateStatus(id: string, status: string): void {
    this.api.updateInquiryStatus(id, status).subscribe({
      next: () => this.fetchInquiries(),
      error: (err) => {
        this.error = err?.error?.error || 'Unable to update inquiry.';
      }
    });
  }
}
