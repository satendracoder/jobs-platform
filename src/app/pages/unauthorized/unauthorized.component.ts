import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="unauthorized-page">
      <div class="container">
        <div class="content">
          <h1>Access Denied</h1>
          <p>You don't have permission to access this page.</p>
          <a routerLink="/" class="btn btn-primary">Go Home</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #F8FAFC;
      padding-top: 70px;
    }
    
    .container {
      max-width: 500px;
      padding: 2rem;
    }
    
    .content {
      background: white;
      padding: 3rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    
    h1 {
      color: #DC2626;
      margin-bottom: 1rem;
    }
    
    p {
      color: #6B7280;
      margin-bottom: 2rem;
    }
  `]
})
export class UnauthorizedComponent {}