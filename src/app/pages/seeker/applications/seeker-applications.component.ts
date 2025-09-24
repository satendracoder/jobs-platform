import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JobService } from '../../../services/job.service';
import { AuthService } from '../../../services/auth.service';
import { Job, JobApplication, User } from '../../../models/user.model';

@Component({
  selector: 'app-seeker-applications',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './seeker-applications.component.html',
  styleUrls: ['./seeker-applications.component.scss']
})
export class SeekerApplicationsComponent implements OnInit {
  currentUser: User | null = null;
  applications: JobApplication[] = [];
  filteredApplications: JobApplication[] = [];
  jobs: Job[] = [];
  selectedStatus = '';
  sortBy = 'date-desc';

  get pendingApplications(): number {
    return this.applications.filter(app => app.status === 'Applied').length;
  }

  get shortlistedApplications(): number {
    return this.applications.filter(app => app.status === 'Shortlisted').length;
  }

  get rejectedApplications(): number {
    return this.applications.filter(app => app.status === 'Rejected').length;
  }

  constructor(
    private jobService: JobService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadApplications();
    this.loadJobs();
  }

  private loadApplications(): void {
    if (this.currentUser?.userID) {
      this.jobService.getApplicationsBySeeker(this.currentUser.userID).subscribe(applications => {
        this.applications = applications;
        this.filteredApplications = [...applications];
        this.sortApplications();
      });
    }
  }

  private loadJobs(): void {
    this.jobService.getJobs().subscribe(jobs => {
      this.jobs = jobs;
    });
  }

  filterApplications(): void {
    if (this.selectedStatus) {
      this.filteredApplications = this.applications.filter(app => app.status === this.selectedStatus);
    } else {
      this.filteredApplications = [...this.applications];
    }
    this.sortApplications();
  }

  sortApplications(): void {
    switch (this.sortBy) {
      case 'date-desc':
        this.filteredApplications.sort((a, b) => 
          new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
        );
        break;
      case 'date-asc':
        this.filteredApplications.sort((a, b) => 
          new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime()
        );
        break;
      case 'status':
        this.filteredApplications.sort((a, b) => a.status.localeCompare(b.status));
        break;
    }
  }

  clearFilters(): void {
    this.selectedStatus = '';
    this.sortBy = 'date-desc';
    this.filterApplications();
  }

  withdrawApplication(applicationId: string): void {
    if (confirm('Are you sure you want to withdraw this application?')) {
      // In a real app, this would call the backend to withdraw the application
      this.applications = this.applications.filter(app => app.applicationID !== applicationId);
      this.filterApplications();
      alert('Application withdrawn successfully.');
    }
  }

  getJobTitle(jobId: string): string {
    const job = this.jobs.find(j => j.jobID === jobId);
    return job ? job.title : 'Job Title';
  }

  getCompanyName(jobId: string): string {
    // In a real app, this would get the actual company name
    return 'Company Name';
  }

  getJobLocation(jobId: string): string {
    const job = this.jobs.find(j => j.jobID === jobId);
    return job ? job.location : 'Location';
  }

  getJobType(jobId: string): string {
    const job = this.jobs.find(j => j.jobID === jobId);
    return job ? job.jobType : 'Job Type';
  }

  getJobSalary(jobId: string): string {
    const job = this.jobs.find(j => j.jobID === jobId);
    return job ? job.salaryRange : 'Salary Range';
  }

  getJobDescription(jobId: string): string {
    const job = this.jobs.find(j => j.jobID === jobId);
    return job ? job.description.substring(0, 150) + '...' : 'Job description';
  }

  getJobSkills(jobId: string): string[] {
    const job = this.jobs.find(j => j.jobID === jobId);
    return job ? job.skills || [] : [];
  }
}