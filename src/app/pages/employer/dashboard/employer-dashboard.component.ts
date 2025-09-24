import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from '../../../services/job.service';
import { AuthService } from '../../../services/auth.service';
import { Job, User } from '../../../models/user.model';

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <div class="dashboard-container">
        <div class="dashboard-header">
          <h1>Employer Dashboard</h1>
          <p class="subtitle">Welcome back, {{ currentUser?.fullName }}!</p>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">💼</div>
            <div class="stat-content">
              <h3>{{ totalJobs }}</h3>
              <p>Active Job Postings</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <h3>{{ totalApplications }}</h3>
              <p>Total Applications</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <h3>0</h3>
              <p>Candidates Hired</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-content">
              <h3>4.8</h3>
              <p>Company Rating</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="action-buttons">
            <a routerLink="/employer/post-job" class="action-btn primary">
              <span class="btn-icon">➕</span>
              Post New Job
            </a>
            <a routerLink="/employer/jobs" class="action-btn secondary">
              <span class="btn-icon">📋</span>
              Manage Jobs
            </a>
            <a routerLink="/jobs" class="action-btn secondary">
              <span class="btn-icon">🔍</span>
              Browse Candidates
            </a>
          </div>
        </div>

        <!-- Recent Jobs -->
        <div class="recent-jobs-section">
          <div class="section-header">
            <h2>Your Recent Job Postings</h2>
            <a routerLink="/employer/jobs" class="view-all">View All →</a>
          </div>
          <div class="jobs-list" *ngIf="recentJobs.length > 0">
            <div class="job-item" *ngFor="let job of recentJobs">
              <div class="job-info">
                <h3>{{ job.title }}</h3>
                <p class="job-details">{{ job.location }} • {{ job.jobType }} • {{ job.salaryRange }}</p>
                <p class="job-description">{{ job.description | slice:0:100 }}...</p>
              </div>
              <div class="job-stats">
                <div class="stat">
                  <span class="stat-number">0</span>
                  <span class="stat-label">Applications</span>
                </div>
                <div class="job-actions">
                  <button class="btn btn-outline btn-sm">Edit</button>
                  <button class="btn btn-primary btn-sm">View</button>
                </div>
              </div>
            </div>
          </div>
          <div class="no-jobs" *ngIf="recentJobs.length === 0">
            <p>You haven't posted any jobs yet. <a routerLink="/employer/post-job">Post your first job</a> to get started!</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./employer-dashboard.component.scss']
})
export class EmployerDashboardComponent implements OnInit {
  currentUser: User | null = null;
  recentJobs: Job[] = [];
  totalJobs = 0;
  totalApplications = 0;

  constructor(
    private jobService: JobService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadEmployerJobs();
  }

  private loadEmployerJobs(): void {
    if (this.currentUser?.userID) {
      this.jobService.getJobsByEmployer(this.currentUser.userID).subscribe(jobs => {
        this.recentJobs = jobs.slice(0, 3);
        this.totalJobs = jobs.length;
        // In a real app, you'd calculate total applications from all jobs
        this.totalApplications = jobs.length * 5; // Mock data
      });
    }
  }
}