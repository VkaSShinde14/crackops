export type ExperienceLevel = "fresher" | "1-3 yrs" | "3-5 yrs" | "5+ yrs";
export type InterviewType =
  | "Azure DevOps Engineer"
  | "DevOps Engineer"
  | "Cloud DevOps"
  | "Senior DevOps";
export type QuestionStatus = "new" | "known" | "weak" | "revision";
export type RevisionCadence = "today" | "tomorrow" | "3 days" | "7 days";
export type Difficulty = "basic" | "intermediate" | "senior";
export type FollowUpLevel = "basic" | "intermediate" | "advanced" | "architect";
export type ViewId =
  | "home"
  | "setup"
  | "learn"
  | "practice"
  | "revise"
  | "mock"
  | "tools"
  | "incidents"
  | "cost"
  | "packs"
  | "project"
  | "graph";

export interface FollowUpNode {
  id: string;
  level: FollowUpLevel;
  question: string;
  answer: string;
  sayIt: string;
  children?: FollowUpNode[];
}

export interface ArchitectureNote {
  whyExists: string;
  problemSolved: string;
  internalArchitecture: string;
  enterpriseFit: string;
  alternatives: string[];
  useWhen: string[];
  avoidWhen: string[];
}

export interface Topic {
  id: string;
  title: string;
  category: string;
  priority: number;
  definition: string;
  interviewAnswer: string;
  deepAnswer: string;
  useCase: string;
  followUps: string[];
  architecture?: ArchitectureNote;
  prerequisites?: string[];
  relatedTopics?: string[];
  relatedTools?: string[];
}

export interface Question {
  id: string;
  topicId: string;
  difficulty: Difficulty;
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  seniorAnswer: string;
  interviewVersion: string;
  followUps?: FollowUpNode[];
}

export interface ToolPage {
  id: string;
  name: string;
  category: string;
  topicId?: string;
  purpose: string;
  internalFlow: string[];
  components: string[];
  architecture: ArchitectureNote;
  alternatives: string[];
  realWorldUsage: string;
  limitations: string[];
  securityNotes: string[];
  interviewQuestions: Question[];
  followUps: FollowUpNode[];
}

export interface IncidentPlaybook {
  id: string;
  title: string;
  area: string;
  symptoms: string[];
  likelyRootCauses: string[];
  investigationFlow: string[];
  fix: string[];
  prevention: string[];
  interviewAnswer: string;
  followUps: FollowUpNode[];
}

export interface CostModule {
  id: string;
  title: string;
  area: string;
  strategies: string[];
  tradeoffs: string[];
  interviewChecklist: string[];
}

export interface CompanyPack {
  id: string;
  company: string;
  style: string;
  frequentTopics: string[];
  roundPattern: string[];
  difficulty: string;
  scenarios: string[];
  answerGuidance: string[];
}

export interface ProjectStory {
  id: string;
  name: string;
  combination: string[];
  intro30: string;
  explanation2Min: string;
  deepTechnical: string;
  responsibilities: string[];
  challenges: string[];
  solution: string[];
  impact: string[];
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type: "topic" | "tool" | "incident" | "cost" | "question";
  summary: string;
  links: string[];
}

export interface Profile {
  experience: ExperienceLevel;
  interviewType: InterviewType;
  daysLeft: number;
  focusTopics: string[];
}

export interface QuestionProgress {
  status: QuestionStatus;
  bookmarked: boolean;
  revision?: RevisionCadence;
  lastReviewed?: string;
}

export type ProgressMap = Record<string, QuestionProgress>;
