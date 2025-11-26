# Project Context: Ark-Hr

## Project Overview
**Ark-Hr** is a modern, high-performance Applicant Tracking System (ATS) designed to streamline the recruitment process. It features a refined, smooth UI with advanced candidate management capabilities, including a Kanban board, detailed application tracking, and rich text job editing.

## Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI (Radix UI primitives)
- **Animations**: Framer Motion (Page transitions, micro-interactions)
- **Tables**: TanStack Table (Advanced filtering, sorting, pagination)
- **Forms**: React Hook Form + Zod (Validation)
- **Rich Text Editor**: TipTap
- **Icons**: Lucide React
- **Utils**: `date-fns`, `clsx`, `tailwind-merge`

## Core Features

### 1. Dashboard & Layout
- **App Sidebar**: Collapsible, smooth-transitioning sidebar navigation.
- **Motion Wrapper**: Page transitions for a fluid user experience.
- **Global Styles**: Smooth scrolling, custom selection styles, and refined typography.

### 2. Jobs Management (`/jobs`)
- **Job Listing**: Display jobs with status (Published/Draft), location, and type.
- **Job Editor**:
    - **Rich Text Editing**: TipTap-based editor for job descriptions.
    - **Sticky Toolbar**: Glassmorphism effect for better UX.
    - **Form Validation**: Zod schema for title, location, type, etc.
    - **Salary Hidden**: Salary fields have been intentionally removed from the UI.

### 3. Application Tracking (`/applications`)
- **Dual Views**: Toggle between **List View** and **Kanban Board**.
- **List View**:
    - **Advanced Filter Bar**: Search by name/email, filter by Job, filter by Status.
    - **Rich Columns**: Applicant details, Skills (with badges), Experience, Applied Date.
    - **TanStack Table**: Sorting, pagination, column visibility, row selection.
- **Kanban Board**:
    - **Drag & Drop Visuals**: Columns for statuses (New, Screening, Interview, Offer, Hired, Rejected).
    - **Detailed Cards**: Applicant info, skills, match score, and time since applied.
    - **Status Colors**: Color-coded columns and card borders.

### 4. Application Details Sheet
- **Comprehensive View**: Opens in a side sheet without leaving the context.
- **Tabs**:
    - **Overview**: Contact info, Social Links (LinkedIn, GitHub, Portfolio), Professional Info, Projects.
    - **Resume**: Placeholder for PDF viewer with download action.
    - **Screener**: Displays answers to application screening questions.
    - **Comments**: Chat-like interface for HR notes and collaboration.
- **Actions**: Copy Email, View Next, Change Status, Assign HR.

## Data Models (`types/index.ts`)

### Job
- `id`, `title`, `description` (HTML), `location`, `locationType`, `type`, `questions`, `status`, `createdAt`, `applicantsCount`.
- *Note: `salaryRange` is removed.*

### Applicant
- `id`, `name`, `email`, `phone`, `avatarUrl`, `resumeUrl`.
- **Rich Profile**: `skills` (string[]), `experience` (number), `currentTitle`, `socialLinks`, `website`, `projects`, `screenerAnswers`.

### Application
- `id`, `jobId`, `applicantId`, `status` (New, Screening, etc.), `appliedAt`, `assignedTo` (HR), `score`, `comments`.

## Key Directories
- `app/(dashboard)`: Main application routes.
- `components/ui`: Reusable UI components (Button, Card, Sheet, etc.).
- `components/jobs`: Job-related components (JobForm, JobCard, JobEditor).
- `components/applications`: Application tracking components (Table, Kanban, Sheet, Filter).
- `lib/mock-data.ts`: Extensive mock data for development.

## UI/UX Philosophy
- **"Refined & Smooth"**: Emphasis on micro-interactions (hover lifts, active scales), smooth transitions, and stable layouts.
- **Glassmorphism**: Subtle use of blur effects in sticky headers.
- **Clean Typography**: Readable fonts and structured hierarchy.
