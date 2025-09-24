import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Job, JobApplication } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private jobs: Job[] = [
    {
      jobID: '1',
      employerID: '1',
      title: 'Senior Frontend Developer',
      description: 'We are looking for a Senior Frontend Developer with expertise in Angular, React, and modern web technologies.',
      location: 'San Francisco, CA',
      salaryRange: '$120,000 - $160,000',
      jobType: 'Full-Time',
      postedDate: new Date('2024-01-15'),
      skills: ['Angular', 'TypeScript', 'HTML', 'CSS', 'JavaScript']
    },
    {
      jobID: '2',
      employerID: '1',
      title: 'Backend Developer',
      description: 'Join our team as a Backend Developer. Experience with Node.js, Python, and database technologies required.',
      location: 'New York, NY',
      salaryRange: '$100,000 - $140,000',
      jobType: 'Full-Time',
      postedDate: new Date('2024-01-20'),
      skills: ['Node.js', 'Python', 'MongoDB', 'REST API']
    },
    {
      jobID: '3',
      employerID: '2',
      title: 'UX/UI Designer',
      description: 'Creative UX/UI Designer needed to create intuitive and beautiful user experiences.',
      location: 'Remote',
      salaryRange: '$80,000 - $110,000',
      jobType: 'Full-Time',
      postedDate: new Date('2024-01-25'),
      skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research']
    },
    {
      jobID: '4',
      employerID: '2',
      title: 'Marketing Intern',
      description: 'Great opportunity for students to gain hands-on experience in digital marketing.',
      location: 'Los Angeles, CA',
      salaryRange: '$15 - $20/hour',
      jobType: 'Internship',
      postedDate: new Date('2024-02-01'),
      skills: ['Social Media', 'Content Creation', 'Analytics']
    }
  ];

  private applications: JobApplication[] = [];

  constructor() {}

  getJobs(filters?: any): Observable<Job[]> {
    let filteredJobs = [...this.jobs];

    if (filters) {
      if (filters.location) {
        filteredJobs = filteredJobs.filter(job => 
          job.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      if (filters.jobType) {
        filteredJobs = filteredJobs.filter(job => job.jobType === filters.jobType);
      }
      if (filters.skills && filters.skills.length > 0) {
        filteredJobs = filteredJobs.filter(job =>
          job.skills?.some(skill => 
            filters.skills.some((filterSkill: string) =>
              skill.toLowerCase().includes(filterSkill.toLowerCase())
            )
          )
        );
      }
      if (filters.searchTerm) {
        filteredJobs = filteredJobs.filter(job =>
          job.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );
      }
    }

    return of(filteredJobs);
  }

  getJobById(id: string): Observable<Job | undefined> {
    const job = this.jobs.find(j => j.jobID === id);
    return of(job);
  }

  createJob(job: Job): Observable<Job> {
    const newJob = { ...job, jobID: Date.now().toString(), postedDate: new Date() };
    this.jobs.unshift(newJob);
    return of(newJob);
  }

  updateJob(jobId: string, jobData: Partial<Job>): Observable<Job> {
    const index = this.jobs.findIndex(j => j.jobID === jobId);
    if (index !== -1) {
      this.jobs[index] = { ...this.jobs[index], ...jobData };
      return of(this.jobs[index]);
    }
    throw new Error('Job not found');
  }

  deleteJob(jobId: string): Observable<boolean> {
    const index = this.jobs.findIndex(j => j.jobID === jobId);
    if (index !== -1) {
      this.jobs.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  getJobsByEmployer(employerId: string): Observable<Job[]> {
    const employerJobs = this.jobs.filter(job => job.employerID === employerId);
    return of(employerJobs);
  }

  applyForJob(jobId: string, seekerId: string): Observable<JobApplication> {
    const application: JobApplication = {
      applicationID: Date.now().toString(),
      jobID: jobId,
      seekerID: seekerId,
      status: 'Applied',
      appliedDate: new Date()
    };
    this.applications.push(application);
    return of(application);
  }

  getApplicationsBySeeker(seekerId: string): Observable<JobApplication[]> {
    const seekerApplications = this.applications.filter(app => app.seekerID === seekerId);
    return of(seekerApplications);
  }

  hasApplied(jobId: string, seekerId: string): boolean {
    return this.applications.some(app => app.jobID === jobId && app.seekerID === seekerId);
  }
}