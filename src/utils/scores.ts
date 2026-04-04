/**
 * Calculate average score from individual components
 * @param impact Score (0-10)
 * @param presentation Score (0-10)
 * @param creativity Score (0-10)
 * @returns Average score (0-10)
 */
export function calculateAverageScore(
  impact: number,
  presentation: number,
  creativity: number
): number {
  return (impact + presentation + creativity) / 3;
}

/**
 * Calculate total score (sum of three scores, max 30)
 * @param impact Score (0-10)
 * @param presentation Score (0-10)
 * @param creativity Score (0-10)
 * @returns Total score (0-30)
 */
export function calculateTotalScore(
  impact: number,
  presentation: number,
  creativity: number
): number {
  return impact + presentation + creativity;
}

/**
 * Get percentage of max score for a single component
 * @param score Individual score (0-10)
 * @returns Percentage (0-100)
 */
export function getScorePercentage(score: number): number {
  return (score / 10) * 100;
}

/**
 * Get percentage of max total score
 * @param totalScore Total score (0-30)
 * @returns Percentage (0-100)
 */
export function getTotalScorePercentage(totalScore: number): number {
  return (totalScore / 30) * 100;
}

/**
 * Get color class for score visualization
 * @param score Score (0-10 for components or 0-30 for total)
 * @param isTotal Whether this is a total score
 * @returns Tailwind color class
 */
export function getScoreColorClass(score: number, isTotal: boolean = false): string {
  const maxScore = isTotal ? 30 : 10;
  const percentage = (score / maxScore) * 100;

  if (percentage >= 90) return 'bg-indrox-gold';
  if (percentage >= 80) return 'bg-indrox-purple';
  if (percentage >= 70) return 'bg-indrox-purple-light';
  if (percentage >= 60) return 'bg-indrox-silver';
  return 'bg-indrox-bronze';
}

/**
 * Get rating description based on score
 * @param score Score (0-10)
 * @returns Rating description
 */
export function getRatingDescription(score: number): string {
  if (score >= 9) return 'Exceptional';
  if (score >= 8) return 'Excellent';
  if (score >= 7) return 'Very Good';
  if (score >= 6) return 'Good';
  if (score >= 5) return 'Acceptable';
  return 'Needs Improvement';
}

/**
 * Calculate participation rate
 * @param wins Number of wins
 * @param participations Total participations
 * @returns Win percentage (0-100)
 */
export function calculateWinRate(wins: number, participations: number): number {
  if (participations === 0) return 0;
  return (wins / participations) * 100;
}

/**
 * Get medal emoji based on rank
 * @param rank Position (1, 2, 3, etc.)
 * @returns Medal emoji or rank number
 */
export function getMedalEmoji(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
}

/**
 * Format score for display
 * @param score Score value
 * @param decimals Number of decimal places
 * @returns Formatted score string
 */
export function formatScore(score: number, decimals: number = 1): string {
  return score.toFixed(decimals);
}
