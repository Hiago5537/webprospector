
export enum WebsiteStatus {
  NO_WEBSITE = 'NO_WEBSITE',
  OUTDATED = 'OUTDATED',
  NEEDS_LANDING = 'NEEDS_LANDING',
  GOOD = 'GOOD'
}

export enum CRMStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  MEETING = 'MEETING',
  CLOSED = 'CLOSED',
  LOST = 'LOST'
}

export interface Competitor {
  name: string;
  website: string;
  advantage: string;
}

export interface BusinessLead {
  id: string;
  name: string;
  industry: string;
  location: string;
  status: WebsiteStatus;
  crmStatus?: CRMStatus;
  website?: string;
  contactInfo?: string;
  description?: string;
  aiAnalysis?: string;
  competitors?: Competitor[];
  auditScore?: number;
  mapUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface SearchFilters {
  niche: string;
  location: string;
  radius: number;
}
