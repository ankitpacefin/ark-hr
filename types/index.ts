export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
export type JobLocationType = 'Office' | 'Remote' | 'Hybrid' | 'Outdoor';
export type JobStatus = 'Draft' | 'Published' | 'Closed';

export interface Job {
  id: string;
  title: string;
  description: string; // HTML content
  location: string;
  locationType: JobLocationType;
  type: JobType;
  salaryRange?: string;
  questions: string[]; // Custom questions for applicants
  status: JobStatus;
  createdAt: string;
  applicantsCount: number;
}

export type ApplicationStatus = 
  | 'New' 
  | 'Screening' 
  | 'Interview' 
  | 'Offer' 
  | 'Hired' 
  | 'Rejected';

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  avatarUrl?: string;
}

export interface HRProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  role: 'Admin' | 'Recruiter';
}

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  applicant: Applicant;
  status: ApplicationStatus;
  appliedAt: string;
  assignedTo?: string; // HR ID
  score?: number; // 0-100
  notes?: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}
