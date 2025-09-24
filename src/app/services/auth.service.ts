import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Simulate API call
    const mockUser: User = {
      userID: '1',
      fullName: credentials.email === 'employer@test.com' ? 'John Employer' : 'Jane Seeker',
      email: credentials.email,
      userType: credentials.email === 'employer@test.com' ? 'Employer' : 'JobSeeker',
      createdAt: new Date()
    };

    const response: AuthResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      user: mockUser
    };

    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);

    return of(response);
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    // Simulate API call
    const mockUser: User = {
      userID: Date.now().toString(),
      fullName: userData.fullName,
      email: userData.email,
      userType: userData.userType,
      createdAt: new Date()
    };

    const response: AuthResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      user: mockUser
    };

    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);

    return of(response);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.userType === role;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}