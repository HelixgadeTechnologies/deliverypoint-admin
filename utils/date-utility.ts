export function formatDateTime(dateString: string): string {
  if (!dateString) return "N/A"
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
// Output: "November 20, 2025, 11:38 AM"

export function timeAgo(dateString: string): string {
  if (!dateString) return "N/A"
  const date = new Date(dateString);
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
// Output: "1 day ago"

export function formatDate(dateString: string, format: 'short' | 'long' | 'full' = 'long'): string {
  const date = new Date(dateString);
  // if (!dateString) return "N/A"
  switch (format) {
    case 'short':
      // Output: "11/20/2025"
      return date.toLocaleDateString('en-US');
    
    case 'long':
      // Output: "November 20, 2025"
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    
    case 'full':
      // Output: "Thursday, November 20, 2025"
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