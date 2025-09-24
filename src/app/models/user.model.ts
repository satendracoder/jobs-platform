export interface User {
  userID?: string;
  fullName: string;
  email: string;
  userType: 'JobSeeker' | 'Employer' | 'Admin';
  createdAt?: Date;
}

export interface JobSeeker {
  seekerID?: string;
  userID: string;
  resumePath?: string;
  skills: string[];
  experienceYears: number;
  location: string;
}

export interface Employer {
  employerID?: string;
  userID: string;
  companyName: string;
  industry: string;
  website?: string;
  contactNo: string;
}

export interface Job {
  jobID?: string;
  employerID: string;
  title: string;
  description: string;
  location: string;
  salaryRange: string;
  jobType: 'Full-Time' | 'Part-Time' | 'Internship';
  postedDate: Date;
  skills?: string[];
}

export interface JobApplication {
  applicationID?: string;
  jobID: string;
  seekerID: string;
  status: 'Applied' | 'Shortlisted' | 'Rejected';
  appliedDate: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  userType: 'JobSeeker' | 'Employer';
}

export interface AuthResponse {
  token: string;
  user: User;
}