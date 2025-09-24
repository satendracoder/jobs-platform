import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JobService } from '../../../services/job.service';
import { AuthService } from '../../../services/auth.service';
import { Job, User } from '../../../models/user.model';

@Component({
  selector: 'app-employer-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './employer-jobs.component.html',
  styleUrls: ['./employer-jobs.component.scss']
})
export class EmployerJobsComponent implements OnInit {
  currentUser: User | null = null;
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  selectedStatus = '';
  sortBy = 'date-desc';
  activeDropdown: string | null = null;

  get totalApplications(): number {
    return this.jobs.length * 8; // Mock data
  }

  get averageApplications(): number {
    return this.jobs.length > 0 ? Math.round(this.totalApplications / this.jobs.length) : 0;
  }

  get recentJobs(): number {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return this.jobs.filter(job => new Date(job.postedDate) > oneMonthAgo).length;
  }

  constructor(
    private jobService: JobService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadEmployerJobs();
    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (!(event.target as Element).closest('.dropdown')) {
        this.activeDropdown = null;
      }
    });
  }

  private loadEmployerJobs(): void {
    if (this.currentUser?.userID) {
      this.jobService.getJobsByEmployer(this.currentUser.userID).subscribe(jobs => {
        this.jobs = jobs;
        this.filteredJobs = [...jobs];
        this.sortJobs();
      });
    }
  }

  filterJobs(): void {
    if (this.selectedStatus) {
      // In a real app, jobs would have status field
      this.filteredJobs = this.jobs.filter(job => {
        // Mock filtering logic
        return this.selectedStatus === 'active'; // All jobs are active in mock data
      });
    } else {
      this.filteredJobs = [...this.jobs];
    }
    this.sortJobs();
  }

  sortJobs(): void {
    switch (this.sortBy) {
      case 'date-desc':
        this.filteredJobs.sort((a, b) => 
          new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        );
        break;
      case 'date-asc':
        this.filteredJobs.sort((a, b) => 
          new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime()
        );
        break;
      case 'applications':
        this.filteredJobs.sort((a, b) => 
          this.getApplicationCount(b.jobID!) - this.getApplicationCount(a.jobID!)
        );
        break;
      case 'title':
        this.filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
  }

  clearFilters(): void {
    this.selectedStatus = '';
    this.sortBy = 'date-desc';
    this.filterJobs();
  }

  getApplicationCount(jobId: string): number {
    // Mock data - in real app, this would come from backend
    return Math.floor(Math.random() * 20) + 1;
  }

  getViewCount(jobId: string): number {
    // Mock data - in real app, this would come from backend
    return Math.floor(Math.random() * 100) + 10;
  }

  toggleDropdown(jobId: string): void {
    this.activeDropdown = this.activeDropdown === jobId ? null : jobId;
  }

  editJob(jobId: string): void {
    // In a real app, navigate to edit job page
    console.log('Edit job:', jobId);
    alert('Edit job functionality would be implemented here');
  }

  viewApplications(jobId: string): void {
    // In a real app, navigate to applications page
    console.log('View applications for job:', jobId);
    alert('View applications functionality would be implemented here');
  }

  duplicateJob(jobId: string): void {
    const jobToDuplicate = this.jobs.find(job => job.jobID === jobId);
    if (jobToDuplicate) {
      const duplicatedJob = {
        ...jobToDuplicate,
        jobID: Date.now().toString(),
        title: jobToDuplicate.title + ' (Copy)',
        postedDate: new Date()
      };
      this.jobs.unshift(duplicatedJob);
      this.filterJobs();
      this.activeDropdown = null;
      alert('Job duplicated successfully!');
    }
  }

  closeJob(jobId: string): void {
    if (confirm('Are you sure you want to close this job posting?')) {
      // In a real app, this would update the job status
      console.log('Close job:', jobId);
      this.activeDropdown = null;
      alert('Job closed successfully!');
    }
  }

  deleteJob(jobId: string): void {
    if (confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      this.jobs = this.jobs.filter(job => job.jobID !== jobId);
      this.filterJobs();
      this.activeDropdown = null;
      alert('Job deleted successfully!');
    }
  }
}