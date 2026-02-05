import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-public-landing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './public-landing.component.html',
  styleUrls: ['./public-landing.component.css']
})
export class PublicLandingComponent implements OnInit {
  profile: any = null;
  loading = false;
  message = '';
  error = '';

  inquiryForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    company: ['', [Validators.required, Validators.minLength(2)]],
    interest: ['Seed production partnership'],
    message: ['']
  });

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.api.getCompanyProfile().subscribe({
      next: (data) => (this.profile = data),
      error: () => (this.error = 'Unable to load company profile right now.')
    });
  }

  submitInquiry(): void {
    this.message = '';
    this.error = '';
    if (this.inquiryForm.invalid) {
      this.inquiryForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.api.submitInquiry(this.inquiryForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        this.message = res?.message || 'Inquiry submitted.';
        this.inquiryForm.reset({
          interest: 'Seed production partnership'
        });
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.error || 'Submission failed. Please try again.';
      }
    });
  }
}
