/**
 * Format date to Spanish locale string
 * @param date Date object
 * @returns Formatted date string (e.g., "7 de abril de 2026")
 */
export function formatDateSpanish(date: Date): string {
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} de ${month} de ${year}`;
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 * @param date Date object
 * @returns ISO date string
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get the next Monday from today
 * @returns Date object for next Monday
 */
export function getNextMonday(): Date {
  const today = new Date();
  const daysUntilMonday = (1 - today.getDay() + 7) % 7 || 7;
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilMonday);
  return nextMonday;
}

/**
 * Format date to readable format for countdown
 * @param date Date object
 * @returns Formatted date string (e.g., "Monday, April 7")
 */
export function formatDateEnglish(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Get current week number
 * @returns ISO week number
 */
export function getCurrentWeekNumber(): number {
  const date = new Date();
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.floor(diff / oneWeek) + 1;
}

/**
 * Get month name from date
 * @param date Date object
 * @returns Month name in Spanish
 */
export function getMonthNameSpanish(date: Date): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[date.getMonth()];
}
