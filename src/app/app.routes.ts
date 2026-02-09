import { Routes } from '@angular/router';
import { PublicLandingComponent } from './pages/public-landing/public-landing.component';
import { LoginComponent } from './pages/login/login.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { authGuard } from './guards/auth.guard';
import { AdminComponent } from './pages/admin/admin.component';
import { adminGuard } from './guards/admin.guard';
import { CropInfoComponent } from './pages/crop-info/crop-info.component';
import { DiagnoseComponent } from './pages/diagnose/diagnose.component';

export const routes: Routes = [
  { path: '', component: PublicLandingComponent },
  { path: 'crops', component: CropInfoComponent },
  { path: 'diagnose', component: DiagnoseComponent },
  { path: 'login', component: LoginComponent },
  { path: 'analytics', component: AnalyticsComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];
