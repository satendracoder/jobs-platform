import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'jobs',
    loadComponent: () => import('./pages/jobs/job-list/job-list.component').then(m => m.JobListComponent)
  },
  {
    path: 'jobs/:id',
    loadComponent: () => import('./pages/jobs/job-detail/job-detail.component').then(m => m.JobDetailComponent)
  },
  {
    path: 'seeker/dashboard',
    loadComponent: () => import('./pages/seeker/dashboard/seeker-dashboard.component').then(m => m.SeekerDashboardComponent),
    canActivate: [AuthGuard],
    data: { role: 'JobSeeker' }
  },
  {
    path: 'seeker/profile',
    loadComponent: () => import('./pages/seeker/profile/seeker-profile.component').then(m => m.SeekerProfileComponent),
    canActivate: [AuthGuard],
    data: { role: 'JobSeeker' }
  },
  {
    path: 'seeker/applications',
    loadComponent: () => import('./pages/seeker/applications/seeker-applications.component').then(m => m.SeekerApplicationsComponent),
    canActivate: [AuthGuard],
    data: { role: 'JobSeeker' }
  },
  {
    path: 'employer/dashboard',
    loadComponent: () => import('./pages/employer/dashboard/employer-dashboard.component').then(m => m.EmployerDashboardComponent),
    canActivate: [AuthGuard],
    data: { role: 'Employer' }
  },
  {
    path: 'employer/post-job',
    loadComponent: () => import('./pages/employer/post-job/post-job.component').then(m => m.PostJobComponent),
    canActivate: [AuthGuard],
    data: { role: 'Employer' }
  },
  {
    path: 'employer/jobs',
    loadComponent: () => import('./pages/employer/jobs/employer-jobs.component').then(m => m.EmployerJobsComponent),
    canActivate: [AuthGuard],
    data: { role: 'Employer' }
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./pages/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];