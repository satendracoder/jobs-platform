import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Job } from '../../models/user.model';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="job-card">
      <div class="job-header">
        <h3 class="job-title">{{ job.title }}</h3>
        <span class="job-type" [class]="'job-type-' + job.jobType.toLowerCase().replace('-', '')">
          {{ job.jobType }}
        </span>
      </div>
      
      <p class="job-description">{{ job.description | slice:0:150 }}{{ job.description.length > 150 ? '...' : '' }}</p>
      
      <div class="job-details">
        <div class="detail-item">
          <span class="icon">📍</span>
          <span>{{ job.location }}</span>
        </div>
        <div class="detail-item">
          <span class="icon">💰</span>
          <span>{{ job.salaryRange }}</span>
        </div>
        <div class="detail-item">
          <span class="icon">📅</span>
          <span>{{ job.postedDate | date:'MMM dd, yyyy' }}</span>
        </div>
      </div>
      
      <div class="job-skills" *ngIf="job.skills && job.skills.length > 0">
        <span class="skill-tag" *ngFor="let skill of job.skills | slice:0:3">{{ skill }}</span>
        <span class="skill-more" *ngIf="job.skills.length > 3">+{{ job.skills.length - 3 }} more</span>
      </div>
      
      <div class="job-actions">
        <button class="btn btn-outline" [routerLink]="['/jobs', job.jobID]">View Details</button>
        <button class="btn btn-primary" (click)="onApply()" *ngIf="showApplyButton && !hasApplied">
          Apply Now
        </button>
        <span class="applied-status" *ngIf="hasApplied">✓ Applied</span>
      </div>
    </div>
  `,
  styleUrls: ['./job-card.component.scss']
})
export class JobCardComponent {
  @Input() job!: Job;
  @Input() showApplyButton = true;
  @Input() hasApplied = false;
  @Output() apply = new EventEmitter<string>();

  onApply(): void {
    this.apply.emit(this.job.jobID);
  }
}