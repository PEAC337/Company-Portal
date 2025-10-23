export interface ResourceLink {
  name: string;
  url: string;
  description: string;
  icon?: 'drive' | 'docs' | 'slack' | 'design' | 'policy' | 'calendar' | 'training' | 'fmcsa';
}

export interface ResourceCategory {
  category: string;
  links: ResourceLink[];
}

// IMPORTANT: Replace these with the actual URLs for your company resources.
export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    category: 'Documents',
    links: [
      { name: 'Shared Drives', url: 'https://drive.google.com/drive/starred', description: 'Access starred files in Google Drive to designate tasks.', icon: 'drive' },
      { name: 'Project Plans', url: 'https://docs.google.com/document/d/1QoJyZU8px1M2JkaZhH-OYZzGD2DNnE2D8LDr14GSI0A/preview', description: 'View all project planning documents.', icon: 'docs' },
    ]
  },
  {
    category: 'Tools',
    links: [
      { name: 'IT Support', url: 'https://app.slack.com/client/T08EY37623B/C09MYHM2SD7', description: 'Contact IT Support on our designated Slack channel.', icon: 'slack' },
      { name: 'Design System', url: 'https://www.canva.com/design-school', description: 'Learn about design principles and tools at Canva Design School.', icon: 'design' },
      { name: 'COPS Training Portal', url: 'https://copstrainingportal.org/elearning/', description: 'Access the Community Oriented Policing Services e-learning platform.', icon: 'training' },
      { name: 'FMCSA Company Snapshot', url: 'https://safer.fmcsa.dot.gov/CompanySnapshot.aspx', description: 'Look up company safety data from the Federal Motor Carrier Safety Administration.', icon: 'fmcsa' },
    ]
  },
  {
    category: 'Information',
    links: [
      { name: 'HR Policies', url: 'https://docs.google.com/document/d/19w6-EiKiyQcsTNOFZSoPc0kE7uQ8KIz-/preview', description: 'Find the latest HR policies and employee handbook.', icon: 'policy' },
      { name: 'Company Calendar', url: 'https://calendar.google.com/calendar/u/0/embed?color=%239fe1e7&src=k.j@peaceoutpost.icu', description: 'View the official company calendar for events and holidays.', icon: 'calendar' },
    ]
  }
];