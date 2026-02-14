import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const defaultColor = '#FFD700';

export const FireIcon: React.FC<IconProps> = ({ size = 16, color = defaultColor, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 23C7.58 23 4 19.42 4 15C4 11.83 5.39 9.36 7.34 7.12C9.13 5.06 11.4 3.2 13.14 1.27C13.38 1 13.85 1.14 13.9 1.5C14.23 3.68 14.92 6.51 17.09 8.43C19.09 10.19 20 12.31 20 15C20 19.42 16.42 23 12 23ZM12.53 3.58C10.91 5.33 9.1 7.13 7.73 9.02C5.96 11.46 6 13.34 6 15C6 18.31 8.69 21 12 21C15.31 21 18 18.31 18 15C18 12.84 17.25 11.19 15.59 9.7C14.09 8.35 13.14 6.53 12.53 3.58Z" />
    <path d="M12 21C9.24 21 7 18.76 7 16C7 13.36 9.01 11.55 10.77 9.97C10.95 9.81 11.23 9.93 11.24 10.17C11.32 11.5 11.73 13.07 13.38 14.13C14.59 14.9 15 15.92 15 16.5C15 18.99 13.76 21 12 21Z" />
  </svg>
);

export const SparkleIcon: React.FC<IconProps> = ({ size = 16, color = defaultColor, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2L12.39 8.26L18 6L13.74 10.61L20 14L12.39 13.74L10 22L9.61 13.74L2 14L8.26 10.61L4 6L9.61 8.26L10 2Z" />
    <path d="M19 2L20 5L23 4L21 7L24 8L20 9L19 12L18 9L15 8L18 7L19 2Z" opacity="0.7" />
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ size = 16, color = defaultColor, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 16, color = defaultColor, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

export const CompassIcon: React.FC<IconProps> = ({ size = 16, color = defaultColor, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill={color} stroke="none" />
  </svg>
);

export const BrainIcon: React.FC<IconProps> = ({ size = 16, color = defaultColor, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C9.5 2 7.5 4 7.5 6.5C7.5 6.5 6 6 5 7.5C4 9 5 11 5 11C3.5 11.5 3 13.5 4 15C4 15 3 16 3.5 18C4 20 6.5 20 6.5 20C6.5 20 7 22 9.5 22C12 22 12 20 12 20" />
    <path d="M12 2C14.5 2 16.5 4 16.5 6.5C16.5 6.5 18 6 19 7.5C20 9 19 11 19 11C20.5 11.5 21 13.5 20 15C20 15 21 16 20.5 18C20 20 17.5 20 17.5 20C17.5 20 17 22 14.5 22C12 22 12 20 12 20" />
    <line x1="12" y1="2" x2="12" y2="22" />
  </svg>
);

export const ChartIcon: React.FC<IconProps> = ({ size = 16, color = defaultColor, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="12" width="4" height="9" rx="1" />
    <rect x="10" y="6" width="4" height="15" rx="1" />
    <rect x="17" y="3" width="4" height="18" rx="1" />
  </svg>
);

export const BookIcon: React.FC<IconProps> = ({ size = 16, color = defaultColor, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <line x1="9" y1="7" x2="16" y2="7" />
    <line x1="9" y1="11" x2="14" y2="11" />
  </svg>
);

export const RefreshIcon: React.FC<IconProps> = ({ size = 16, color = defaultColor, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <polyline points="23,4 23,10 17,10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);
