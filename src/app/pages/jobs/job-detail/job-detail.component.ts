import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../../../services/job.service';
import { AuthService } from '../../../services/auth.service';
import { Job, User } from '../../../models/user.model';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="job-detail-page" *ngIf="job">
      <div class="page-container">
        <div class="job-detail-card">
          <div class="job-header">
            <div class="job-info">
              <h1 class="job-title">{{ job.title }}</h1>
              <div class="job-meta">
                <span class="company">Company Name</span>
                <span class="separator">•</span>
                <span class="location">{{ job.location }}</span>
                <span class="separator">•</span>
                <span class="posted-date">Posted {{ job.postedDate | date:'MMM dd, yyyy' }}</span>
              </div>
              <div class="job-type-salary">
                <span class="job-type" [class]="'job-type-' + job.jobType.toLowerCase().replace('-', '')">
                  {{ job.jobType }}
                </span>
                <span class="salary">{{ job.salaryRange }}</span>
              </div>
            </div>
            <div class="job-actions" *ngIf="currentUser?.userType === 'JobSeeker'">
              <button 
                class="btn btn-primary" 
                (click)="applyToJob()" 
                [disabled]="hasApplied"
                *ngIf="!hasApplied"
              >
                Apply Now
              </button>
              <span class="applied-status" *ngIf="hasApplied">✓ Application Submitted</span>
            </div>
          </div>

          <div class="job-content">
            <section class="job-description">
              <h2>Job Description</h2>
              <p>{{ job.description }}</p>
            </section>

            <section class="job-requirements" *ngIf="job.skills && job.skills.length > 0">
              <h2>Required Skills</h2>
              <div class="skills-list">
                <span class="skill-tag" *ngFor="let skill of job.skills">{{ skill }}</span>
              </div>
            </section>

            <section class="job-details">
              <h2>Job Details</h2>
              <div class="details-grid">
                <div class="detail-item">
                  <strong>Job Type:</strong>
                  <span>{{ job.jobType }}</span>
                </div>
                <div class="detail-item">
                  <strong>Location:</strong>
                  <span>{{ job.location }}</span>
                </div>
                <div class="detail-item">
                  <strong>Salary Range:</strong>
                  <span>{{ job.salaryRange }}</span>
                </div>
                <div class="detail-item">
                  <strong>Posted Date:</strong>
                  <span>{{ job.postedDate | date:'MMM dd, yyyy' }}</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div class="back-button">
          <button class="btn btn-outline" (click)="goBack()">← Back to Jobs</button>
        </div>
      </div>
    </div>

    <div class="loading" *ngIf="!job">
      <div class="spinner"></div>
      <p>Loading job details...</p>
    </div>
  `,
  styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent implements OnInit {
  job: Job | null = null;
  currentUser: User | null = null;
  hasApplied = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    if (jobId) {
      this.loadJobDetails(jobId);
      this.checkApplicationStatus(jobId);
    }
  }

  private loadJobDetails(jobId: string): void {
    this.jobService.getJobById(jobId).subscribe(job => {
      this.job = job || null;
    });
  }

  private checkApplicationStatus(jobId: string): void {
    if (this.currentUser?.userType === 'JobSeeker') {
      this.hasApplied = this.jobService.hasApplied(jobId, this.currentUser.userID!);
    }
  }

  applyToJob(): void {
    if (!this.currentUser?.userID || !this.job?.jobID) return;

    this.jobService.applyForJob(this.job.jobID, this.currentUser.userID).subscribe(() => {
      this.hasApplied = true;
      alert('Application submitted successfully!');
    });
  }

  goBack(): void {
    this.router.navigate(['/jobs']);
  }
}