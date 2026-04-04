export interface ProjectSummary {
  weekSlug: string;
  week: number;
  title: string;
  date: string;
  totalScore: number;
  isWinner: boolean;
}

export interface ParticipantData {
  slug: string;
  name: string;
  role: string;
  area: 'Engineering' | 'Design' | 'Marketing' | 'Sales' | 'Operations' | 'Product';
  photo: string;
  totalScore: number;
  wins: number;
  participations: number;
  joinedWeek: number;
  bio: string;
  projects: ProjectSummary[];
}

export type AreaFilter = ParticipantData['area'] | 'all';
export type WinsFilter = 'all' | '1+' | '2+' | '3+';
export type RankTier = 'legend' | 'challenger' | 'aspirant' | 'elite' | 'standard';

export function getRankTier(rank: number): RankTier {
  if (rank === 1) return 'legend';
  if (rank === 2) return 'challenger';
  if (rank === 3) return 'aspirant';
  if (rank <= 10) return 'elite';
  return 'standard';
}

export function getMedalEmoji(rank: number): string {
  if (rank === 1) return '👑';
  if (rank === 2) return '⭐';
  if (rank === 3) return '🔥';
  return `#${rank}`;
}

export function getRankLabel(rank: number): string {
  if (rank === 1) return 'LEGEND';
  if (rank === 2) return 'CHALLENGER';
  if (rank === 3) return 'ASPIRANT';
  if (rank <= 10) return 'ELITE';
  return '';
}
