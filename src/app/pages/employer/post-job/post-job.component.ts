import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../../../services/job.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-post-job',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.scss']
})
export class PostJobComponent {
  jobForm: FormGroup;
  currentUser: User | null = null;
  skills: string[] = [];
  newSkill = '';
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  skillSuggestions = [
    'JavaScript', 'TypeScript', 'Angular', 'React', 'Node.js', 'Python',
    'Java', 'C#', 'HTML', 'CSS', 'SQL', 'MongoDB', 'AWS', 'Docker',
    'Git', 'Agile', 'Scrum', 'REST API', 'GraphQL', 'Kubernetes'
  ];

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.jobForm = this.fb.group({
      title: ['', [Validators.required]],
      location: ['', [Validators.required]],
      jobType: ['', [Validators.required]],
      salaryRange: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(50)]]
    });
  }

  addSkill(): void {
    if (this.newSkill.trim() && !this.skills.includes(this.newSkill.trim())) {
      this.skills.push(this.newSkill.trim());
      this.newSkill = '';
    }
  }

  addSuggestedSkill(skill: string): void {
    if (!this.skills.includes(skill)) {
      this.skills.push(skill);
    }
  }

  removeSkill(index: number): void {
    this.skills.splice(index, 1);
  }

  saveDraft(): void {
    const draftData = {
      ...this.jobForm.value,
      skills: this.skills
    };
    localStorage.setItem('jobDraft', JSON.stringify(draftData));
    this.successMessage = 'Draft saved successfully!';
    setTimeout(() => this.successMessage = '', 3000);
  }

  onSubmit(): void {
    if (this.jobForm.valid && this.currentUser?.userID) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const jobData = {
        ...this.jobForm.value,
        employerID: this.currentUser.userID,
        skills: this.skills
      };

      this.jobService.createJob(jobData).subscribe({
        next: (job) => {
          this.isLoading = false;
          this.successMessage = 'Job posted successfully!';
          
          // Clear form and redirect after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/employer/jobs']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to post job. Please try again.';
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields.';
    }
  }
}