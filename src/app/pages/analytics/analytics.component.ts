import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  data: any = null;
  loading = false;
  error = '';
  filters: any = null;
  selectedDirection = 'export';
  selectedCommodity = 'All';
  selectedCountry = 'All';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.getAnalyticsSummary().subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
        this.loadFilters();
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.error || 'Unable to load analytics.';
      }
    });
  }

  loadFilters(): void {
    this.api.getAnalyticsFilters().subscribe({
      next: (res) => {
        this.filters = res;
      },
      error: () => {
        this.filters = this.buildFallbackFilters();
      }
    });
  }

  buildFallbackFilters(): any {
    if (!this.data) return null;
    const commodities = [...new Set([...this.data.topExports, ...this.data.topImports].map((item: any) => item.commodity))];
    const countries = [...new Set(this.data.topDestinations.map((item: any) => item.country))];
    return {
      directions: ['export', 'import'],
      commodities,
      countries,
      periods: this.data.trends.map((trend: any) => trend.period)
    };
  }

  get activeCommodities(): any[] {
    if (!this.data) return [];
    const source = this.selectedDirection === 'export' ? this.data.topExports : this.data.topImports;
    return source.filter((item: any) => this.selectedCommodity === 'All' || item.commodity === this.selectedCommodity);
  }

  get activeDestinations(): any[] {
    if (!this.data) return [];
    return this.data.topDestinations.filter(
      (item: any) => this.selectedCountry === 'All' || item.country === this.selectedCountry
    );
  }

  maxValue(items: any[], key: string): number {
    if (!items?.length) return 1;
    return Math.max(...items.map((item) => item[key] || 0));
  }

  buildLinePoints(key: 'exportsUsd' | 'importsUsd'): string {
    if (!this.data?.trends?.length) return '';
    const values = this.data.trends.map((t: any) => t[key]);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const height = 120;
    const width = 420;
    return values
      .map((value: number, index: number) => {
        const x = (index / (values.length - 1)) * width;
        const range = max - min || 1;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
      })
      .join(' ');
  }
}
