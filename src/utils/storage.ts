export const FAVORITES_KEY = 'thriftit_duvall_saved_stores_v1';
export const COMPARE_KEY = 'thriftit_duvall_compare_stores_v1';
export const SELECTED_SCHOOL_KEY = 'thriftit_duvall_active_school_v1';

export function getSavedStoreIds(): string[] {
  try {
    const val = localStorage.getItem(FAVORITES_KEY);
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}

export function saveStoreIds(ids: string[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch {}
}

export function getCompareStoreIds(): string[] {
  try {
    const val = localStorage.getItem(COMPARE_KEY);
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}

export function saveCompareStoreIds(ids: string[]): void {
  try {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(ids));
  } catch {}
}

export function getStoredSchoolId(): string | null {
  try {
    return localStorage.getItem(SELECTED_SCHOOL_KEY);
  } catch {
    return null;
  }
}

export function saveStoredSchoolId(id: string | null): void {
  try {
    if (id) localStorage.setItem(SELECTED_SCHOOL_KEY, id);
    else localStorage.removeItem(SELECTED_SCHOOL_KEY);
  } catch {}
}

export function validateReviewSubmission(data: {
  author: string;
  comment: string;
  rating: number;
  honeypot?: string;
}): { isValid: boolean; error?: string } {
  if (data.honeypot && data.honeypot.trim().length > 0) {
    return { isValid: false, error: 'Spam detected.' };
  }
  if (!data.author || data.author.trim().length < 2) {
    return { isValid: false, error: 'Please enter your name or student handle (min 2 chars).' };
  }
  if (!data.comment || data.comment.trim().length < 5) {
    return { isValid: false, error: 'Please share a brief tip or review (min 5 chars).' };
  }
  if (!data.rating || data.rating < 1 || data.rating > 5) {
    return { isValid: false, error: 'Please select a rating between 1 and 5 stars.' };
  }
  return { isValid: true };
}
