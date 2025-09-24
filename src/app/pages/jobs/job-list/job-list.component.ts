import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup } from "@angular/forms";
import { JobService } from "../../../services/job.service";
import { AuthService } from "../../../services/auth.service";
import { Job, User } from "../../../models/user.model";
import { JobCardComponent } from "../../../components/job-card/job-card.component";

@Component({
  selector: "app-job-list",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, JobCardComponent],
  template: `
    <div class="job-list-page">
      <div class="page-container">
        <!-- Search and Filters -->
        <div class="search-section">
          <h1>Find Your Perfect Job</h1>
          <form [formGroup]="searchForm" class="search-form">
            <div class="search-row">
              <div class="form-group">
                <input
                  type="text"
                  formControlName="searchTerm"
                  placeholder="Job title, keywords, or company"
                  class="search-input"
                />
              </div>
              <div class="form-group">
                <input
                  type="text"
                  formControlName="location"
                  placeholder="Location"
                  class="search-input"
                />
              </div>
              <button
                type="button"
                class="btn btn-primary"
                (click)="searchJobs()"
              >
                Search Jobs
              </button>
            </div>
          </form>

          <!-- Filters -->
          <div class="filters">
            <div class="filter-group">
              <label>Job Type:</label>
              <select
                formControlName="jobType"
                class="filter-select"
                (change)="searchJobs()"
              >
                <option value="">All Types</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Skills:</label>
              <input
                type="text"
                formControlName="skills"
                placeholder="e.g., Angular, JavaScript"
                class="filter-input"
                (input)="searchJobs()"
              />
            </div>
            <button
              type="button"
              class="btn btn-outline"
              (click)="clearFilters()"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <!-- Results -->
        <div class="results-section">
          <div class="results-header">
            <h2>{{ jobs.length }} Jobs Found</h2>
          </div>

          <div class="jobs-grid" *ngIf="jobs.length > 0">
            <app-job-card
              *ngFor="let job of jobs"
              [job]="job"
              [showApplyButton]="currentUser?.userType === 'JobSeeker'"
              [hasApplied]="hasAppliedToJob(job.jobID!)"
              (apply)="applyToJob($event)"
            ></app-job-card>
          </div>

          <div class="no-results" *ngIf="jobs.length === 0">
            <h3>No jobs found</h3>
            <p>
              Try adjusting your search criteria or check back later for new
              opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./job-list.component.scss"],
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  searchForm: FormGroup;
  currentUser: User | null = null;
  appliedJobs: Set<string> = new Set();

  constructor(
    private jobService: JobService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [""],
      location: [""],
      jobType: [""],
      skills: [""],
    });

    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.searchJobs();
    this.loadUserApplications();
  }

  searchJobs(): void {
    const formValue = this.searchForm.value;
    const filters = {
      searchTerm: formValue.searchTerm,
      location: formValue.location,
      jobType: formValue.jobType,
      skills: formValue.skills
        ? formValue.skills.split(",").map((s: string) => s.trim())
        : [],
    };

    // Remove empty filters
    Object.keys(filters).forEach((key) => {
      const filterKey = key as keyof typeof filters;
      if (
        !filters[filterKey] ||
        (Array.isArray(filters[filterKey]) &&
          (filters[filterKey] as any[]).length === 0)
      ) {
        delete filters[filterKey];
      }
    });

    this.jobService.getJobs(filters).subscribe((jobs) => {
      this.jobs = jobs;
    });
  }

  clearFilters(): void {
    this.searchForm.reset();
    this.searchJobs();
  }

  applyToJob(jobId: string): void {
    if (!this.currentUser || this.currentUser.userType !== "JobSeeker") {
      return;
    }

    this.jobService
      .applyForJob(jobId, this.currentUser.userID!)
      .subscribe(() => {
        this.appliedJobs.add(jobId);
        alert("Application submitted successfully!");
      });
  }

  hasAppliedToJob(jobId: string): boolean {
    return this.appliedJobs.has(jobId);
  }

  private loadUserApplications(): void {
    if (this.currentUser?.userType === "JobSeeker") {
      this.jobService
        .getApplicationsBySeeker(this.currentUser.userID!)
        .subscribe((applications) => {
          applications.forEach((app) => this.appliedJobs.add(app.jobID));
        });
    }
  }
}
