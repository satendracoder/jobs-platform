import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                type="email"
                id="email"
                formControlName="email"
                class="form-control"
                [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                placeholder="Enter your email"
              />
              <div class="error-message" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                <span *ngIf="loginForm.get('email')?.errors?.['required']">Email is required</span>
                <span *ngIf="loginForm.get('email')?.errors?.['email']">Please enter a valid email</span>
              </div>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                formControlName="password"
                class="form-control"
                [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                placeholder="Enter your password"
              />
              <div class="error-message" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                <span *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</span>
                <span *ngIf="loginForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</span>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" [disabled]="loginForm.invalid || isLoading">
              <span *ngIf="!isLoading">Sign In</span>
              <span *ngIf="isLoading">Signing In...</span>
            </button>

            <div class="error-message" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>
          </form>

          <div class="auth-footer">
            <p>Don't have an account? <a routerLink="/register">Sign up here</a></p>
            <div class="demo-accounts">
              <small>Demo accounts:</small>
              <div class="demo-buttons">
                <button class="demo-btn" (click)="loginAsSeeker()">Job Seeker Demo</button>
                <button class="demo-btn" (click)="loginAsEmployer()">Employer Demo</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.user.userType === 'JobSeeker') {
            this.router.navigate(['/seeker/dashboard']);
          } else if (response.user.userType === 'Employer') {
            this.router.navigate(['/employer/dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Invalid email or password';
        }
      });
    }
  }

  loginAsSeeker(): void {
    this.loginForm.patchValue({
      email: 'seeker@test.com',
      password: 'password123'
    });
    this.onSubmit();
  }

  loginAsEmployer(): void {
    this.loginForm.patchValue({
      email: 'employer@test.com',
      password: 'password123'
    });
    this.onSubmit();
  }
}