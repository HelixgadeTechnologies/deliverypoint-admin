import { Timestamp } from "firebase/firestore";

type DateInput = string | Timestamp | { seconds: number; nanoseconds: number } | Date | null | undefined;

// Helper to convert any date input to Date object
function toDate(input: DateInput): Date | null {
  if (!input) return null;
  
  // Already a Date
  if (input instanceof Date) return input;
  
  // Firebase Timestamp
  if (input instanceof Timestamp) return input.toDate();
  
  // Plain object with seconds/nanoseconds (Firebase Timestamp from JSON)
  if (typeof input === "object" && "seconds" in input) {
    return new Date(input.seconds * 1000);
  }
  
  // String
  if (typeof input === "string") return new Date(input);
  
  return null;
}

export function formatDateTime(dateInput: DateInput): string {
  const date = toDate(dateInput);
  if (!date) return "N/A";
  
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function timeAgo(dateInput: DateInput): string {
  const date = toDate(dateInput);
  if (!date) return "N/A";
  
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
}

export function formatDate(dateInput: DateInput, format: 'short' | 'long' | 'full' = 'long'): string {
  const date = toDate(dateInput);
  if (!date) return "N/A";
  
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US');
    
    case 'long':
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    
    case 'full':
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    
    default:
      return date.toLocaleDateString();
  }
}