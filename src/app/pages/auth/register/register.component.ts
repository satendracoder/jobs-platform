import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <h2>Join Quantified HR</h2>
            <p>Create your account to get started</p>
          </div>

          <form
            [formGroup]="registerForm"
            (ngSubmit)="onSubmit()"
            class="auth-form"
          >
            <div class="form-group">
              <label for="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                formControlName="fullName"
                class="form-control"
                [class.error]="
                  registerForm.get('fullName')?.invalid &&
                  registerForm.get('fullName')?.touched
                "
                placeholder="Enter your full name"
              />
              <div
                class="error-message"
                *ngIf="
                  registerForm.get('fullName')?.invalid &&
                  registerForm.get('fullName')?.touched
                "
              >
                <span *ngIf="registerForm.get('fullName')?.errors?.['required']"
                  >Full name is required</span
                >
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                type="email"
                id="email"
                formControlName="email"
                class="form-control"
                [class.error]="
                  registerForm.get('email')?.invalid &&
                  registerForm.get('email')?.touched
                "
                placeholder="Enter your email"
              />
              <div
                class="error-message"
                *ngIf="
                  registerForm.get('email')?.invalid &&
                  registerForm.get('email')?.touched
                "
              >
                <span *ngIf="registerForm.get('email')?.errors?.['required']"
                  >Email is required</span
                >
                <span *ngIf="registerForm.get('email')?.errors?.['email']"
                  >Please enter a valid email</span
                >
              </div>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                formControlName="password"
                class="form-control"
                [class.error]="
                  registerForm.get('password')?.invalid &&
                  registerForm.get('password')?.touched
                "
                placeholder="Enter your password"
              />
              <div
                class="error-message"
                *ngIf="
                  registerForm.get('password')?.invalid &&
                  registerForm.get('password')?.touched
                "
              >
                <span *ngIf="registerForm.get('password')?.errors?.['required']"
                  >Password is required</span
                >
                <span
                  *ngIf="registerForm.get('password')?.errors?.['minlength']"
                  >Password must be at least 6 characters</span
                >
              </div>
            </div>

            <div class="form-group">
              <label for="userType">I am a:</label>
              <select
                id="userType"
                formControlName="userType"
                class="form-control"
                [class.error]="
                  registerForm.get('userType')?.invalid &&
                  registerForm.get('userType')?.touched
                "
              >
                <option value="">Select user type</option>
                <option value="JobSeeker">Job Seeker</option>
                <option value="Employer">Employer</option>
              </select>
              <div
                class="error-message"
                *ngIf="
                  registerForm.get('userType')?.invalid &&
                  registerForm.get('userType')?.touched
                "
              >
                <span *ngIf="registerForm.get('userType')?.errors?.['required']"
                  >Please select a user type</span
                >
              </div>
            </div>

            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="registerForm.invalid || isLoading"
            >
              <span *ngIf="!isLoading">Create Account</span>
              <span *ngIf="isLoading">Creating Account...</span>
            </button>

            <div class="error-message" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>
          </form>

          <div class="auth-footer">
            <p>
              Already have an account? <a routerLink="/login">Sign in here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["../login/login.component.scss"],
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = "";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      userType: ["", [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = "";

      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.user.userType === "JobSeeker") {
            this.router.navigate(["/seeker/dashboard"]);
          } else if (response.user.userType === "Employer") {
            this.router.navigate(["/employer/dashboard"]);
          } else {
            this.router.navigate(["/"]);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = "Registration failed. Please try again.";
        },
      });
    }
  }
}
