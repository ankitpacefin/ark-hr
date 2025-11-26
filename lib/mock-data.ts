import { Job, Application, HRProfile } from '@/types';

export const MOCK_HR_PROFILES: HRProfile[] = [
    { id: 'hr-1', name: 'Alice Johnson', role: 'Admin', avatarUrl: 'https://i.pravatar.cc/150?u=hr-1' },
    { id: 'hr-2', name: 'Bob Smith', role: 'Recruiter', avatarUrl: 'https://i.pravatar.cc/150?u=hr-2' },
    { id: 'hr-3', name: 'Charlie Davis', role: 'Recruiter', avatarUrl: 'https://i.pravatar.cc/150?u=hr-3' },
];

export const MOCK_JOBS: Job[] = [
    {
        id: 'job-1',
        title: 'Senior Frontend Engineer',
        description: '<p>We are looking for an experienced Frontend Engineer to join our team...</p>',
        location: 'New York, NY',
        locationType: 'Hybrid',
        type: 'Full-time',
        questions: ['Years of experience with React?', 'Link to portfolio?'],
        status: 'Published',
        createdAt: '2023-10-01T10:00:00Z',
        applicantsCount: 12,
    },
    {
        id: 'job-2',
        title: 'Product Designer',
        description: '<p>Join our design team to create amazing user experiences...</p>',
        location: 'San Francisco, CA',
        locationType: 'Office',
        type: 'Full-time',
        questions: ['Link to Dribbble/Behance?'],
        status: 'Published',
        createdAt: '2023-10-05T14:30:00Z',
        applicantsCount: 8,
    },
    {
        id: 'job-3',
        title: 'Marketing Intern',
        description: '<p>Great opportunity for students...</p>',
        location: 'Remote',
        locationType: 'Remote',
        type: 'Internship',
        questions: ['Available start date?'],
        status: 'Draft',
        createdAt: '2023-10-10T09:00:00Z',
        applicantsCount: 0,
    },
];

export const MOCK_APPLICATIONS: Application[] = [
    {
        id: 'app-1',
        jobId: 'job-1',
        applicantId: 'applicant-1',
        applicant: {
            id: 'applicant-1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1 555-0101',
            avatarUrl: 'https://i.pravatar.cc/150?u=applicant-1',
            resumeUrl: '#',
            skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
            experience: 5,
            currentTitle: 'Frontend Developer',
            socialLinks: {
                github: 'https://github.com/johndoe',
                linkedin: 'https://linkedin.com/in/johndoe',
                portfolio: 'https://johndoe.dev'
            },
            projects: [
                { name: 'E-commerce Dashboard', url: 'https://github.com/johndoe/dashboard', description: 'A comprehensive dashboard for e-commerce analytics.' },
                { name: 'Task Manager', url: 'https://github.com/johndoe/task-manager', description: 'Collaborative task management app.' }
            ],
            screenerAnswers: [
                { question: 'Years of experience with React?', answer: '5 years' },
                { question: 'Link to portfolio?', answer: 'https://johndoe.dev' }
            ]
        },
        status: 'New',
        appliedAt: '2023-10-12T08:00:00Z',
        comments: [],
    },
    {
        id: 'app-2',
        jobId: 'job-1',
        applicantId: 'applicant-2',
        applicant: {
            id: 'applicant-2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+1 555-0102',
            avatarUrl: 'https://i.pravatar.cc/150?u=applicant-2',
            resumeUrl: '#',
            skills: ['Vue.js', 'JavaScript', 'CSS', 'HTML'],
            experience: 3,
            currentTitle: 'Web Developer',
            socialLinks: {
                linkedin: 'https://linkedin.com/in/janesmith',
            },
            screenerAnswers: [
                { question: 'Years of experience with React?', answer: '1 year, mostly use Vue.' },
                { question: 'Link to portfolio?', answer: 'Attached in resume.' }
            ]
        },
        status: 'Screening',
        appliedAt: '2023-10-12T09:15:00Z',
        assignedTo: 'hr-2',
        score: 85,
        comments: [
            {
                id: 'c-1',
                authorId: 'hr-2',
                authorName: 'Bob Smith',
                content: 'Looks promising, good React experience.',
                createdAt: '2023-10-12T10:00:00Z',
            },
        ],
    },
    {
        id: 'app-3',
        jobId: 'job-2',
        applicantId: 'applicant-3',
        applicant: {
            id: 'applicant-3',
            name: 'Mike Brown',
            email: 'mike@example.com',
            phone: '+1 555-0103',
            avatarUrl: 'https://i.pravatar.cc/150?u=applicant-3',
            resumeUrl: '#',
            skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping'],
            experience: 4,
            currentTitle: 'UI/UX Designer',
            socialLinks: {
                linkedin: 'https://linkedin.com/in/mikebrown',
                portfolio: 'https://dribbble.com/mikebrown'
            },
            projects: [
                { name: 'Mobile Banking App', url: 'https://dribbble.com/shots/12345', description: 'Redesign of a major banking app.' }
            ],
            screenerAnswers: [
                { question: 'Link to Dribbble/Behance?', answer: 'https://dribbble.com/mikebrown' }
            ]
        },
        status: 'Interview',
        appliedAt: '2023-10-13T11:00:00Z',
        assignedTo: 'hr-1',
        comments: [],
    },
    {
        id: 'app-4',
        jobId: 'job-1',
        applicantId: 'applicant-4',
        applicant: {
            id: 'applicant-4',
            name: 'Sarah Wilson',
            email: 'sarah@example.com',
            phone: '+1 555-0104',
            avatarUrl: 'https://i.pravatar.cc/150?u=applicant-4',
            resumeUrl: '#',
            skills: ['Angular', 'TypeScript', 'Java'],
            experience: 6,
            currentTitle: 'Senior Software Engineer',
            socialLinks: {
                github: 'https://github.com/sarahwilson'
            },
            screenerAnswers: [
                { question: 'Years of experience with React?', answer: 'None, willing to learn.' },
                { question: 'Link to portfolio?', answer: 'N/A' }
            ]
        },
        status: 'Rejected',
        appliedAt: '2023-10-11T16:45:00Z',
        assignedTo: 'hr-3',
        notes: 'Not enough experience with TypeScript.',
        comments: [],
    },
    {
        id: 'app-5',
        jobId: 'job-3',
        applicantId: 'applicant-5',
        applicant: {
            id: 'applicant-5',
            name: 'Emily Chen',
            email: 'emily@example.com',
            phone: '+1 555-0105',
            avatarUrl: 'https://i.pravatar.cc/150?u=applicant-5',
            resumeUrl: '#',
            skills: ['Social Media', 'Content Creation', 'Canva'],
            experience: 0,
            currentTitle: 'Student',
            socialLinks: {
                linkedin: 'https://linkedin.com/in/emilychen'
            },
            screenerAnswers: [
                { question: 'Available start date?', answer: 'June 1st' }
            ]
        },
        status: 'New',
        appliedAt: '2023-10-14T10:00:00Z',
        comments: [],
    },
    {
        id: 'app-6',
        jobId: 'job-1',
        applicantId: 'applicant-6',
        applicant: {
            id: 'applicant-6',
            name: 'David Kim',
            email: 'david@example.com',
            phone: '+1 555-0106',
            avatarUrl: 'https://i.pravatar.cc/150?u=applicant-6',
            resumeUrl: '#',
            skills: ['React', 'Redux', 'Next.js', 'GraphQL'],
            experience: 4,
            currentTitle: 'Frontend Engineer',
            socialLinks: {
                github: 'https://github.com/davidkim',
                linkedin: 'https://linkedin.com/in/davidkim'
            },
            screenerAnswers: [
                { question: 'Years of experience with React?', answer: '4 years' },
                { question: 'Link to portfolio?', answer: 'https://davidkim.io' }
            ]
        },
        status: 'Offer',
        appliedAt: '2023-10-09T14:20:00Z',
        assignedTo: 'hr-1',
        comments: [
            {
                id: 'c-2',
                authorId: 'hr-1',
                authorName: 'Alice Johnson',
                content: 'Excellent technical interview performance.',
                createdAt: '2023-10-15T11:30:00Z',
            },
        ],
    },
    {
        id: 'app-7',
        jobId: 'job-2',
        applicantId: 'applicant-7',
        applicant: {
            id: 'applicant-7',
            name: 'Lisa Patel',
            email: 'lisa@example.com',
            phone: '+1 555-0107',
            avatarUrl: 'https://i.pravatar.cc/150?u=applicant-7',
            resumeUrl: '#',
            skills: ['Figma', 'User Research', 'Wireframing'],
            experience: 2,
            currentTitle: 'Junior Designer',
            socialLinks: {
                portfolio: 'https://lisadesigns.com'
            },
            screenerAnswers: [
                { question: 'Link to Dribbble/Behance?', answer: 'https://dribbble.com/lisapatel' }
            ]
        },
        status: 'Hired',
        appliedAt: '2023-10-02T09:00:00Z',
        assignedTo: 'hr-2',
        comments: [],
    }
];
