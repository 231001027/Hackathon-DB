import type { ActivityItem, AppNotification } from '@/types';

// Static content for the landing page ----------------------------------

export const FEATURES = [
  {
    icon: 'Brain',
    title: 'AI Software Track',
    description: 'Build AI-powered assistive applications — speech recognition, NLP, AAC tools, and intelligent systems using machine learning.',
  },
  {
    icon: 'Cpu',
    title: 'Hardware Track',
    description: 'Design smart assistive devices — IoT communication aids, sensor-based systems, and embedded hardware prototypes.',
  },
  {
    icon: 'Users',
    title: 'Team Registration',
    description: 'Register your squad of up to 5 members with a guided, validated multi-step form.',
  },
  {
    icon: 'LayoutDashboard',
    title: 'Student Dashboard',
    description: 'Track your team, members, progress, and submission status in one elegant view.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Admin Dashboard',
    description: 'Manage every registered team, review submissions, and view analytics at a glance.',
  },
  {
    icon: 'FileUp',
    title: 'PDF Submission',
    description: 'Only the team leader uploads the final project PDF — secure and permission-controlled.',
  },
  {
    icon: 'Activity',
    title: 'Submission Tracking',
    description: 'Real-time submission status, progress bars, and recent activity for every team.',
  },
  {
    icon: 'BellRing',
    title: 'Notifications',
    description: 'Stay updated with in-app notifications for registrations, submissions, and deadlines.',
  },
] as const;

export const TIMELINE = [
  {
    step: '01',
    title: 'Registration Opens',
    description: 'Team leaders register their squad with college, department, and member details on the SmartAbility portal.',
    icon: 'ClipboardList',
  },
  {
    step: '02',
    title: 'Problem Statement Selection',
    description: 'Choose one of 11 real-world assistive technology problem statements focused on speech, hearing and communication.',
    icon: 'Target',
  },
  {
    step: '03',
    title: 'Build & Innovate',
    description: 'Design and develop your solution — software, hardware, AI-powered app, or smart device — before the deadline.',
    icon: 'Cpu',
  },
  {
    step: '04',
    title: 'Project Submission',
    description: 'The team leader uploads the final project PDF. Submission closes at midnight on 01 August 2026.',
    icon: 'FileUp',
  },
  {
    step: '05',
    title: 'Evaluation & Winners',
    description: 'Domain experts and judges evaluate submissions. Top teams win a share of the ₹1,00,000 prize pool.',
    icon: 'Trophy',
  },
] as const;

export const FAQS = [
  {
    q: 'What are the project tracks in SmartAbility?',
    a: 'SmartAbility has two tracks: (1) AI Software — build AI-powered applications such as speech recognition tools, NLP systems, AAC apps, or intelligent assistive software; (2) Hardware — design smart assistive devices such as IoT communication aids, sensor-based systems, or embedded hardware prototypes.',
  },
  {
    q: 'Who can participate in SmartAbility?',
    a: 'Any college student, innovator, researcher, or multidisciplinary team can participate. You will register as a team leader, add up to 4 additional members (5 total), and provide your college and department details.',
  },
  {
    q: 'What is the theme of SmartAbility?',
    a: 'SmartAbility is an Innovation Challenge on Assistive Technology focused on building AI software applications and hardware devices to support Speech, Hearing and Communication for persons with disabilities.',
  },
  {
    q: 'How many problem statements are there?',
    a: 'There are 11 real-world problem statements identified from the assistive technology domain. Participants choose one and build either an AI software or hardware solution around it.',
  },
  {
    q: 'What is the total prize value?',
    a: 'The total prize value is ₹1,00,000 distributed across winning teams in both AI software and hardware tracks.',
  },
  {
    q: 'When and where is the hackathon?',
    a: 'SmartAbility is scheduled on 01 August 2026, organised by the Centre of Excellence in Assistive Technology, Rajalakshmi Engineering College, in association with NIEPMD.',
  },
  {
    q: 'Who are the coordinators?',
    a: 'Convenor: Dr. S. Poonkuzhali. Coordinators: Dr. Priya Vijay and Mrs. D. Sorna Shanthi.',
  },
  {
    q: 'Who is allowed to upload the final project PDF?',
    a: 'Only the registered Team Leader is authorized to upload the final project PDF. Team members can view submission status but cannot upload files themselves.',
  },
] as const;

export const STATS = [
  { label: 'Problem Statements', value: 11, icon: 'ClipboardList' },
  { label: 'Prize Pool (₹)', value: 100000, icon: 'Trophy' },
  { label: 'Hackathon Date', value: 1, icon: 'Calendar' },
  { label: 'Colleges Invited', value: 32, icon: 'Building2' },
] as const;

// Admin dummy data ------------------------------------------------------

export const REGISTRATION_CHART = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 28 },
  { label: 'Wed', value: 45 },
  { label: 'Thu', value: 38 },
  { label: 'Fri', value: 62 },
  { label: 'Sat', value: 84 },
  { label: 'Sun', value: 50 },
];

export const SUBMISSION_CHART = [
  { label: 'Wk 1', value: 8 },
  { label: 'Wk 2', value: 22 },
  { label: 'Wk 3', value: 41 },
  { label: 'Wk 4', value: 67 },
];

export const DEPARTMENT_DISTRIBUTION = [
  { label: 'CSE', value: 42, color: '#4f46e5' },
  { label: 'IT', value: 28, color: '#7c3aed' },
  { label: 'ECE', value: 18, color: '#0ea5e9' },
  { label: 'AI/DS', value: 22, color: '#8b5cf6' },
  { label: 'Other', value: 18, color: '#38bdf8' },
];

export const SAMPLE_ACTIVITIES: ActivityItem[] = [
  { id: 'a1', icon: 'UserPlus', title: 'New team "Code Cavaliers" registered', time: '2 min ago', tone: 'brand' },
  { id: 'a2', icon: 'FileUp', title: 'Team "Pixel Pioneers" submitted their project', time: '18 min ago', tone: 'emerald' },
  { id: 'a3', icon: 'BellRing', title: 'Deadline reminder sent to 12 teams', time: '1 hr ago', tone: 'amber' },
  { id: 'a4', icon: 'Users', title: 'Team "Quantum Coders" added a new member', time: '3 hr ago', tone: 'sky' },
  { id: 'a5', icon: 'Trophy', title: 'Evaluation panel opened for Round 2', time: '5 hr ago', tone: 'accent' },
];

export const SAMPLE_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Submission Deadline: 01 August 2026',
    body: 'Final project PDFs are due on 01 Aug 2026. Ensure your team leader has uploaded before midnight.',
    time: '12 min ago',
    read: false,
    tone: 'warning',
  },
  {
    id: 'n2',
    title: 'Welcome to SmartAbility 2026!',
    body: 'Your team has been successfully registered. Explore 11 problem statements and start building!',
    time: '1 day ago',
    read: false,
    tone: 'success',
  },
  {
    id: 'n3',
    title: 'Organised by CEAT, Rajalakshmi Engineering College',
    body: 'SmartAbility is conducted in association with Dept. of Speech, Hearing & Communication, NIEPMD.',
    time: '2 days ago',
    read: true,
    tone: 'info',
  },
];

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Register', to: '/register' },
  { label: 'Student Login', to: '/student-login' },
  { label: 'Admin Login', to: '/admin-login' },
];
