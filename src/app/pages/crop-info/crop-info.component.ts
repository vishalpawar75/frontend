import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface CropVariety {
  name: string;
  maturityDays: string;
  yield: string;
  traits: string[];
}

interface CropInfo {
  id: string;
  name: string;
  description: string;
  season: string;
  soil: string;
  spacing: string;
  seedRate: string;
  irrigation: string;
  fertilizer: string;
  varieties: CropVariety[];
  imageUrl?: string;
  imageCredit?: { title: string; author: string; license: string; sourceUrl: string };
  stages?: { label: string; imageUrl: string; tips?: string[]; credit?: { title: string; author: string; license: string; sourceUrl: string } }[];
  durationDays?: string;
  recommendedStates?: string[];
  category?: string;
}

const LANG_OPTIONS = [
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'हिंदी' },
  { id: 'mr', label: 'मराठी' },
  { id: 'gu', label: 'ગુજરાતી' },
  { id: 'te', label: 'తెలుగు' },
  { id: 'ta', label: 'தமிழ்' },
  { id: 'kn', label: 'ಕನ್ನಡ' }
];

@Component({
  selector: 'app-crop-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crop-info.component.html',
  styleUrls: ['./crop-info.component.css']
})
export class CropInfoComponent implements OnInit, OnDestroy {
  languages = LANG_OPTIONS;
  selectedLanguage = 'en';
  query = '';
  activeCrop: CropInfo | null = null;
  categories: { id: string; name: string; crops: CropInfo[] }[] = [];
  allCategories: { id: string; name: string; crops: CropInfo[] }[] = [];
  selectedCategory = 'all';
  selectedSeason = 'all';
  selectedDuration = 'all';
  selectedSoil = 'all';
  selectedState = 'all';
  loading = false;
  error = '';
  audioStatus = '';
  stageIndex = 0;
  isModalOpen = false;
  popularCropIds = ['tomato', 'rice', 'wheat', 'cotton', 'onion', 'okra'];
  seasonalFilters = [
    { id: 'kharif', label: 'Kharif' },
    { id: 'rabi', label: 'Rabi' },
    { id: 'summer', label: 'Summer' }
  ];
  savedCrops = new Set<string>();
  private readonly savedKey = 'vakratund_saved_crops';
  private stageTimer: number | null = null;
  autoAdvanceMs = 5000;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadSaved();
    this.fetchCrops();
  }

  ngOnDestroy(): void {
    this.stopAutoAdvance();
    document.body.classList.remove('modal-open');
  }

  fetchCrops(queryOverride?: string): void {
    this.loading = true;
    this.error = '';
    const query = queryOverride ?? '';
    this.api.getCrops(this.selectedLanguage, query).subscribe({
      next: (res) => {
        this.allCategories = res.categories || [];
        this.categories = this.allCategories;
        const firstCrop = this.categories[0]?.crops?.[0] || null;
        if (!this.activeCrop && firstCrop) this.activeCrop = firstCrop;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load crops right now.';
      }
    });
  }

  get filteredCategories() {
    const query = this.query.trim().toLowerCase();
    const source = this.allCategories;
    const filtered = source
      .map((cat) => ({
        ...cat,
        crops: cat.crops.filter((crop) => {
          const matchesCategory = this.selectedCategory === 'all' || cat.id === this.selectedCategory;
          const matchesQuery = !query || crop.name.toLowerCase().includes(query);
          const matchesSeason = this.selectedSeason === 'all' || crop.season.toLowerCase().includes(this.selectedSeason);
          const matchesSoil = this.selectedSoil === 'all' || crop.soil.toLowerCase().includes(this.selectedSoil);
          const matchesState =
            this.selectedState === 'all' || crop.recommendedStates?.includes(this.selectedState);
          const matchesDuration =
            this.selectedDuration === 'all' || this.durationBucket(crop.durationDays) === this.selectedDuration;
          return matchesCategory && matchesQuery && matchesSeason && matchesSoil && matchesState && matchesDuration;
        })
      }))
      .filter((cat) => cat.crops.length > 0);
    return filtered;
  }

  selectCrop(crop: CropInfo): void {
    this.activeCrop = crop;
    this.audioStatus = '';
  }

  toggleSave(crop: CropInfo): void {
    if (this.savedCrops.has(crop.id)) {
      this.savedCrops.delete(crop.id);
    } else {
      this.savedCrops.add(crop.id);
    }
    this.persistSaved();
  }

  get popularCrops(): CropInfo[] {
    const list: CropInfo[] = [];
    this.allCategories.forEach((cat) => {
      cat.crops.forEach((crop) => {
        if (this.popularCropIds.includes(crop.id)) list.push(crop);
      });
    });
    return list;
  }

  get savedList(): CropInfo[] {
    const list: CropInfo[] = [];
    this.allCategories.forEach((cat) => {
      cat.crops.forEach((crop) => {
        if (this.savedCrops.has(crop.id)) list.push(crop);
      });
    });
    return list;
  }

  get totalCategories(): number {
    return this.allCategories.length;
  }

  get totalCrops(): number {
    return this.allCategories.reduce((sum, cat) => sum + (cat.crops?.length || 0), 0);
  }

  get totalLanguages(): number {
    return this.languages.length;
  }

  private persistSaved(): void {
    localStorage.setItem(this.savedKey, JSON.stringify(Array.from(this.savedCrops)));
  }

  private loadSaved(): void {
    const raw = localStorage.getItem(this.savedKey);
    if (!raw) return;
    try {
      const ids = JSON.parse(raw) as string[];
      this.savedCrops = new Set(ids);
    } catch {
      this.savedCrops = new Set();
    }
  }

  openModal(crop: CropInfo): void {
    this.activeCrop = crop;
    this.audioStatus = '';
    this.stageIndex = 0;
    document.body.classList.add('modal-open');
    this.isModalOpen = true;
    this.startAutoAdvance();
  }

  closeModal(): void {
    document.body.classList.remove('modal-open');
    this.isModalOpen = false;
    this.stopAutoAdvance();
  }

  nextStage(): void {
    if (!this.activeCrop?.stages?.length) return;
    this.stageIndex = (this.stageIndex + 1) % this.activeCrop.stages.length;
  }

  prevStage(): void {
    if (!this.activeCrop?.stages?.length) return;
    const max = this.activeCrop.stages.length;
    this.stageIndex = (this.stageIndex - 1 + max) % max;
  }

  setStage(index: number): void {
    this.stageIndex = index;
  }

  private startAutoAdvance(): void {
    if (!this.activeCrop?.stages?.length) return;
    this.stopAutoAdvance();
    this.stageTimer = window.setInterval(() => this.nextStage(), this.autoAdvanceMs);
  }

  private stopAutoAdvance(): void {
    if (this.stageTimer !== null) {
      window.clearInterval(this.stageTimer);
      this.stageTimer = null;
    }
  }

  setLanguage(lang: string): void {
    this.selectedLanguage = lang;
    this.fetchCrops();
  }

  applySearch(): void {
    this.audioStatus = '';
    this.fetchCrops(this.query.trim());
  }

  clearSearch(): void {
    this.query = '';
    this.audioStatus = '';
    this.fetchCrops();
  }

  get seasonOptions(): string[] {
    const seasons = new Set<string>();
    this.allCategories.forEach((cat) =>
      cat.crops.forEach((crop) => {
        if (crop.season) seasons.add(crop.season);
      })
    );
    return Array.from(seasons);
  }

  get soilOptions(): string[] {
    const soils = new Set<string>();
    this.allCategories.forEach((cat) =>
      cat.crops.forEach((crop) => {
        if (crop.soil) soils.add(crop.soil);
      })
    );
    return Array.from(soils);
  }

  get stateOptions(): string[] {
    const states = new Set<string>();
    this.allCategories.forEach((cat) =>
      cat.crops.forEach((crop) => {
        crop.recommendedStates?.forEach((state) => states.add(state));
      })
    );
    return Array.from(states);
  }

  durationBucket(duration?: string): string {
    if (!duration) return 'Unknown';
    const match = duration.match(/(\\d+)/);
    if (!match) return 'Unknown';
    const days = Number(match[1]);
    if (days <= 90) return 'Short (≤90 days)';
    if (days <= 140) return 'Medium (91–140 days)';
    return 'Long (141+ days)';
  }

  get durationOptions(): string[] {
    return ['Short (≤90 days)', 'Medium (91–140 days)', 'Long (141+ days)', 'Unknown'];
  }

  get voiceLang(): string {
    const map: Record<string, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      mr: 'mr-IN',
      gu: 'gu-IN',
      te: 'te-IN',
      ta: 'ta-IN',
      kn: 'kn-IN'
    };
    return map[this.selectedLanguage] || 'en-IN';
  }

  readAloud(): void {
    if (!this.activeCrop) return;
    if (!('speechSynthesis' in window)) {
      this.audioStatus = 'Audio not supported on this device.';
      return;
    }

    const regional = this.activeCrop.recommendedStates?.length
      ? `Recommended states: ${this.activeCrop.recommendedStates.join(', ')}.`
      : '';

    const text = [
      this.activeCrop.name,
      this.activeCrop.description,
      `Season: ${this.activeCrop.season}.`,
      `Soil: ${this.activeCrop.soil}.`,
      `Spacing: ${this.activeCrop.spacing}.`,
      `Seed rate: ${this.activeCrop.seedRate}.`,
      `Irrigation: ${this.activeCrop.irrigation}.`,
      `Fertilizer: ${this.activeCrop.fertilizer}.`,
      regional
    ]
      .filter(Boolean)
      .join(' ');

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.voiceLang;
    const voices = window.speechSynthesis.getVoices();
    const matched = voices.find((voice) => voice.lang === this.voiceLang || voice.lang.startsWith(this.voiceLang.split('-')[0]));
    if (matched) utterance.voice = matched;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    this.audioStatus = 'Playing audio...';
  }

  readVariety(variety: CropVariety): void {
    if (!('speechSynthesis' in window)) {
      this.audioStatus = 'Audio not supported on this device.';
      return;
    }
    const text = [
      `Variety: ${variety.name}.`,
      `Maturity: ${variety.maturityDays}.`,
      `Yield: ${variety.yield}.`,
      `Traits: ${variety.traits.join(', ')}.`
    ].join(' ');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.voiceLang;
    const voices = window.speechSynthesis.getVoices();
    const matched = voices.find((voice) => voice.lang === this.voiceLang || voice.lang.startsWith(this.voiceLang.split('-')[0]));
    if (matched) utterance.voice = matched;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    this.audioStatus = 'Playing variety audio...';
  }

  readRegional(): void {
    if (!this.activeCrop?.recommendedStates?.length) {
      this.audioStatus = 'No regional recommendations available.';
      return;
    }
    if (!('speechSynthesis' in window)) {
      this.audioStatus = 'Audio not supported on this device.';
      return;
    }
    const text = `Recommended states for ${this.activeCrop.name}: ${this.activeCrop.recommendedStates.join(', ')}.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.voiceLang;
    const voices = window.speechSynthesis.getVoices();
    const matched = voices.find((voice) => voice.lang === this.voiceLang || voice.lang.startsWith(this.voiceLang.split('-')[0]));
    if (matched) utterance.voice = matched;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    this.audioStatus = 'Playing regional recommendations...';
  }

  downloadPdf(): void {
    if (!this.activeCrop) return;
    const crop = this.activeCrop;
    const html = `
      <html>
        <head>
          <title>${crop.name} Crop Guide</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #1f2a1f; }
            h1 { margin-bottom: 8px; }
            .meta { margin-bottom: 16px; color: #5c6659; }
            .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
            .card { padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; }
            .section { margin-top: 18px; }
            .variety { margin-bottom: 10px; }
            .chips span { display: inline-block; margin-right: 6px; margin-top: 4px; padding: 3px 8px; background: #eee; border-radius: 999px; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>${crop.name}</h1>
          <div class="meta">${crop.description}</div>
          <div class="grid">
            <div class="card"><strong>Season:</strong> ${crop.season}</div>
            <div class="card"><strong>Soil:</strong> ${crop.soil}</div>
            <div class="card"><strong>Spacing:</strong> ${crop.spacing}</div>
            <div class="card"><strong>Seed rate:</strong> ${crop.seedRate}</div>
            <div class="card"><strong>Irrigation:</strong> ${crop.irrigation}</div>
            <div class="card"><strong>Fertilizer:</strong> ${crop.fertilizer}</div>
            ${crop.durationDays ? `<div class="card"><strong>Duration:</strong> ${crop.durationDays}</div>` : ''}
          </div>
          ${crop.recommendedStates?.length ? `<div class="section"><strong>Recommended states:</strong> ${crop.recommendedStates.join(', ')}</div>` : ''}
          <div class="section">
            <h2>Varieties</h2>
            ${crop.varieties
              .map(
                (v) => `
              <div class="variety">
                <strong>${v.name}</strong> — ${v.maturityDays} — ${v.yield}
                <div class="chips">${v.traits.map((t) => `<span>${t}</span>`).join('')}</div>
              </div>`
              )
              .join('')}
          </div>
        </body>
      </html>
    `;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  }

  stopAudio(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.audioStatus = 'Audio stopped.';
    }
  }
}
