import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { JobService } from '../../../services/job.service';
import { User, JobApplication } from '../../../models/user.model';

@Component({
  selector: 'app-seeker-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './seeker-profile.component.html',
  styleUrls: ['./seeker-profile.component.scss']
})
export class SeekerProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;
  applications: JobApplication[] = [];
  skills: string[] = [];
  newSkill = '';
  resumeFile: File | null = null;
  isLoading = false;

  skillSuggestions = [
    'JavaScript', 'TypeScript', 'Angular', 'React', 'Node.js', 'Python',
    'Java', 'C#', 'HTML', 'CSS', 'SQL', 'MongoDB', 'AWS', 'Docker'
  ];

  get profileCompleteness(): number {
    const formValue = this.profileForm.value;
    let completedFields = 0;
    const totalFields = 6;

    if (formValue.fullName) completedFields++;
    if (formValue.email) completedFields++;
    if (formValue.location) completedFields++;
    if (formValue.experienceYears) completedFields++;
    if (this.skills.length > 0) completedFields++;
    if (this.resumeFile) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private jobService: JobService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.profileForm = this.fb.group({
      fullName: [this.currentUser?.fullName || '', [Validators.required]],
      email: [this.currentUser?.email || '', [Validators.required, Validators.email]],
      location: [''],
      experienceYears: [''],
      preferredJobType: [''],
      expectedSalary: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserApplications();
    this.loadSavedProfile();
  }

  private loadUserApplications(): void {
    if (this.currentUser?.userID) {
      this.jobService.getApplicationsBySeeker(this.currentUser.userID).subscribe(applications => {
        this.applications = applications;
      });
    }
  }

  private loadSavedProfile(): void {
    // In a real app, this would load from the backend
    const savedProfile = localStorage.getItem('seekerProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      this.profileForm.patchValue(profile);
      this.skills = profile.skills || [];
    }
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

  onResumeSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(file.type)) {
        alert('Please select a PDF, DOC, or DOCX file.');
        return;
      }

      if (file.size > maxSize) {
        alert('File size must be less than 10MB.');
        return;
      }

      this.resumeFile = file;
    }
  }

  removeResume(): void {
    this.resumeFile = null;
    const fileInput = document.getElementById('resume') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;

      const profileData = {
        ...this.profileForm.value,
        skills: this.skills,
        resumeFile: this.resumeFile?.name || null
      };

      // In a real app, this would save to the backend
      localStorage.setItem('seekerProfile', JSON.stringify(profileData));

      setTimeout(() => {
        this.isLoading = false;
        alert('Profile updated successfully!');
      }, 1000);
    }
  }

  resetForm(): void {
    this.profileForm.reset();
    this.skills = [];
    this.resumeFile = null;
    this.newSkill = '';
    
    // Reset to current user data
    this.profileForm.patchValue({
      fullName: this.currentUser?.fullName || '',
      email: this.currentUser?.email || ''
    });
  }
}