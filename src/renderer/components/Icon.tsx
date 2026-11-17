import type { ReactNode } from 'react';

export type IconName =
  | 'news'
  | 'events'
  | 'ratings'
  | 'community'
  | 'shop'
  | 'support'
  | 'gear'
  | 'stats'
  | 'gift'
  | 'left'
  | 'right'
  | 'sparkle'
  | 'mail'
  | 'lock'
  | 'eye'
  | 'eyeOff';

function content(name: IconName): ReactNode {
  switch (name) {
    case 'news':
      return (
        <>
          <rect x="5" y="4" width="14" height="16" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </>
      );
    case 'events':
      return (
        <>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 3v4M16 3v4" />
        </>
      );
    case 'ratings':
      return (
        <>
          <path d="M8 4h8v5a4 4 0 0 1-8 0V4z" />
          <path d="M8 5H5v2a3 3 0 0 0 3 3M16 5h3v2a3 3 0 0 1-3 3" />
          <path d="M12 13v4M9 20h6" />
        </>
      );
    case 'community':
      return (
        <>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20a6 6 0 0 1 12 0" />
          <circle cx="17" cy="9" r="2.2" />
          <path d="M15 20a5 5 0 0 1 6 0" />
        </>
      );
    case 'shop':
      return (
        <>
          <rect x="3" y="7" width="18" height="12" rx="1.5" />
          <path d="M3 12h18M10 12v3h4v-3" />
        </>
      );
    case 'support':
      return (
        <>
          <path d="M4 13a8 8 0 0 1 16 0" />
          <rect x="3" y="13" width="4" height="6" rx="2" />
          <rect x="17" y="13" width="4" height="6" rx="2" />
        </>
      );
    case 'gear':
      return (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
        </>
      );
    case 'stats':
      return <path d="M4 20V11M10 20V4M16 20v-6M2 20h20" />;
    case 'gift':
      return (
        <>
          <rect x="3" y="9" width="18" height="11" rx="1" />
          <path d="M3 13h18M12 9v11M8 9a2.5 2.5 0 0 1 0-5c2 0 4 5 4 5M16 9a2.5 2.5 0 0 0 0-5c-2 0-4 5-4 5" />
        </>
      );
    case 'left':
      return <path d="M15 5l-7 7 7 7" />;
    case 'right':
      return <path d="M9 5l7 7-7 7" />;
    case 'sparkle':
      return <path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />;
    case 'mail':
      return (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M4 7l8 6 8-6" />
        </>
      );
    case 'lock':
      return (
        <>
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </>
      );
    case 'eye':
      return (
        <>
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
          <circle cx="12" cy="12" r="2.6" />
        </>
      );
    case 'eyeOff':
      return (
        <>
          <path d="M2 12s3.5-6 10-6c2 0 3.8.6 5.3 1.4M22 12s-3.5 6-10 6c-2 0-3.8-.6-5.3-1.4" />
          <path d="M4 4l16 16" />
        </>
      );
    default:
      return null;
  }
}

interface Props {
  name: IconName;
  className?: string;
}

export default function Icon({ name, className = 't9-icon' }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {content(name)}
    </svg>
  );
}
