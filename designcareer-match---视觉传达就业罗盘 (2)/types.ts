

export type TestMode = 'basic' | 'standard' | 'deep';

export interface Question {
  id: number;
  text: string;
  category: 'creative' | 'logic' | 'empathy' | 'execution' | 'commercial' | 'tech' | 'spatial' | 'management';
  module: 'subconscious' | 'practical' | 'values'; // Phases of the test
}

export interface Answer {
  questionId: number;
  value: number; // 1-5
}

export interface EducationFit {
  vocational: string; // 中专/职高
  college: string;    // 大专
  bachelor: string;   // 本科
  master: string;     // 硕博
}

export interface JobMatch {
  jobTitle: string;
  matchScore: number; // 0-100
  tags: string[];
  description: string; // High level concept
  
  // Deep Analysis
  fitReason?: string; // Why you fit
  dailyWork?: string; // What you actually do (The Grind)
  
  // School & Learning
  curriculumFocus?: string[]; // Key university courses to take seriously
  softwareStack?: string[]; // Tools
  selfStudyGoals?: string[]; // Actionable goals (formerly schoolGoals)
  
  // Portfolio & Internship
  portfolioFocus?: string; // What projects to show
  internshipPath?: string; // Where to go, timeline, benefits
  
  // Career & Market
  salaryRange?: string;
  salaryCompetitiveness?: number; // 1-10
  involutionIndex?: string;
  futureOutlook?: string;
  careerGrowth?: string; // Promotion path & How to make money
  sideHustleChannels?: string[]; // Specific websites or methods to make extra money
  painPoints?: string[]; // Real world negatives (Detailed)
  
  educationFit?: EducationFit;
}

export interface AnalysisResult {
  userPersona: string;
  topMatches: JobMatch[];
  abilityRadar: {
    subject: string;
    A: number;
    fullMark: number;
  }[];
  marketAnalysis: string;
}

export enum AppState {
  WELCOME,
  MODE_SELECT,
  LOCKED_GATE, // New state for entering access code
  QUIZ,
  ANALYZING,
  RESULT,
  ERROR
}