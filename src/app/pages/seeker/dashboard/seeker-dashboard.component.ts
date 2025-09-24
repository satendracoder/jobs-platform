import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from '../../../services/job.service';
import { AuthService } from '../../../services/auth.service';
import { Job, JobApplication, User } from '../../../models/user.model';
import { JobCardComponent } from '../../../components/job-card/job-card.component';

@Component({
  selector: 'app-seeker-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, JobCardComponent],
  template: `
    <div class="dashboard">
      <div class="dashboard-container">
        <div class="dashboard-header">
          <h1>Welcome back, {{ currentUser?.fullName }}!</h1>
          <p class="subtitle">Here's your job search overview</p>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📝</div>
            <div class="stat-content">
              <h3>{{ applications.length }}</h3>
              <p>Applications Submitted</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⏳</div>
            <div class="stat-content">
              <h3>{{ pendingApplications }}</h3>
              <p>Pending Reviews</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-content">
              <h3>{{ shortlistedApplications }}</h3>
              <p>Shortlisted</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
              <h3>{{ recentJobs.length }}</h3>
              <p>New Opportunities</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="action-buttons">
            <a routerLink="/jobs" class="action-btn primary">
              <span class="btn-icon">🔍</span>
              Browse Jobs
            </a>
            <a routerLink="/seeker/profile" class="action-btn secondary">
              <span class="btn-icon">👤</span>
              Update Profile
            </a>
            <a routerLink="/seeker/applications" class="action-btn secondary">
              <span class="btn-icon">📋</span>
              View Applications
            </a>
          </div>
        </div>

        <!-- Recent Job Opportunities -->
        <div class="recent-jobs-section">
          <div class="section-header">
            <h2>Latest Job Opportunities</h2>
            <a routerLink="/jobs" class="view-all">View All →</a>
          </div>
          <div class="jobs-grid" *ngIf="recentJobs.length > 0">
            <app-job-card
              *ngFor="let job of recentJobs"
              [job]="job"
              [showApplyButton]="true"
              [hasApplied]="hasAppliedToJob(job.jobID!)"
              (apply)="applyToJob($event)"
            ></app-job-card>
          </div>
          <div class="no-jobs" *ngIf="recentJobs.length === 0">
            <p>No new job opportunities at the moment. Check back later!</p>
          </div>
        </div>

        <!-- Recent Applications -->
        <div class="recent-applications-section" *ngIf="applications.length > 0">
          <h2>Your Recent Applications</h2>
          <div class="applications-table">
            <div class="table-header">
              <span>Job Title</span>
              <span>Company</span>
              <span>Applied Date</span>
              <span>Status</span>
            </div>
            <div class="table-row" *ngFor="let application of applications | slice:0:5">
              <span class="job-title">{{ getJobTitle(application.jobID) }}</span>
              <span class="company">Company Name</span>
              <span class="date">{{ application.appliedDate | date:'MMM dd, yyyy' }}</span>
              <span class="status" [class]="'status-' + application.status.toLowerCase()">
                {{ application.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./seeker-dashboard.component.scss']
})
export class SeekerDashboardComponent implements OnInit {
  currentUser: User | null = null;
  recentJobs: Job[] = [];
  applications: JobApplication[] = [];
  appliedJobs: Set<string> = new Set();

  get pendingApplications(): number {
    return this.applications.filter(app => app.status === 'Applied').length;
  }

  get shortlistedApplications(): number {
    return this.applications.filter(app => app.status === 'Shortlisted').length;
  }

  constructor(
    private jobService: JobService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadRecentJobs();
    this.loadUserApplications();
  }

  private loadRecentJobs(): void {
    this.jobService.getJobs().subscribe(jobs => {
      this.recentJobs = jobs.slice(0, 3);
    });
  }

  private loadUserApplications(): void {
    if (this.currentUser?.userID) {
      this.jobService.getApplicationsBySeeker(this.currentUser.userID).subscribe(applications => {
        this.applications = applications;
        applications.forEach(app => this.appliedJobs.add(app.jobID));
      });
    }
  }

  applyToJob(jobId: string): void {
    if (!this.currentUser?.userID) return;

    this.jobService.applyForJob(jobId, this.currentUser.userID).subscribe(() => {
      this.appliedJobs.add(jobId);
      this.loadUserApplications();
      alert('Application submitted successfully!');
    });
  }

  hasAppliedToJob(jobId: string): boolean {
    return this.appliedJobs.has(jobId);
  }

  getJobTitle(jobId: string): string {
    const job = this.recentJobs.find(j => j.jobID === jobId);
    return job ? job.title : 'Job Title';
  }
}