/**
 * Client-side progress tracking using localStorage
 * Tracks lesson completion status per user
 */

import { announceProgress } from '../scripts/progress-announcer';

const PROGRESS_KEY = 'quran-learn-progress';

interface ProgressData {
  completedLessons: string[];
  lastUpdated: string;
}

/**
 * Get all progress data from localStorage
 */
function getProgressData(): ProgressData {
  if (typeof window === 'undefined') {
    return { completedLessons: [], lastUpdated: new Date().toISOString() };
  }

  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    if (!data) {
      return { completedLessons: [], lastUpdated: new Date().toISOString() };
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading progress data:', error);
    return { completedLessons: [], lastUpdated: new Date().toISOString() };
  }
}

/**
 * Save progress data to localStorage
 */
function saveProgressData(data: ProgressData): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving progress data:', error);
    return false;
  }
}

/**
 * Check if a lesson is marked as complete
 */
export async function isLessonComplete(lessonSlug: string): Promise<boolean> {
  const data = getProgressData();
  return data.completedLessons.includes(lessonSlug);
}

/**
 * Mark a lesson as complete
 */
export async function markLessonComplete(lessonSlug: string): Promise<boolean> {
  const data = getProgressData();

  // Don't add duplicates
  if (data.completedLessons.includes(lessonSlug)) {
    return true;
  }

  data.completedLessons.push(lessonSlug);
  data.lastUpdated = new Date().toISOString();

  const success = saveProgressData(data);

  // Announce to screen readers (wrapped in try-catch to never break progress tracking)
  try {
    announceProgress(`Lesson completed. ${data.completedLessons.length} lessons finished.`);
  } catch (error) {
    console.error('Failed to announce progress:', error);
  }

  return success;
}

/**
 * Get all completed lesson slugs
 */
export function getCompletedLessons(): string[] {
  const data = getProgressData();
  return data.completedLessons;
}

/**
 * Get completion count for a specific level
 */
export function getLevelCompletionCount(level: number): number {
  const completed = getCompletedLessons();
  // Lesson slugs follow pattern: level-N/XX-lesson-name
  const levelPrefix = `level-${level}/`;
  return completed.filter(slug => slug.startsWith(levelPrefix)).length;
}

/**
 * Clear all progress (useful for testing/reset)
 */
export function clearProgress(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    localStorage.removeItem(PROGRESS_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing progress:', error);
    return false;
  }
}
