import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = 'w-8 h-8', size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="DevInsight AI Logo"
    >
      <defs>
        <linearGradient id="brandBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#030712" />
        </linearGradient>
        <linearGradient id="brandBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <linearGradient id="brandBracketLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="brandBracketRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <linearGradient id="brandCoreStar" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <filter id="brandGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Rounded Squircle Container */}
      <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#brandBgGrad)" />
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="16"
        stroke="url(#brandBorderGrad)"
        strokeWidth="2.5"
        strokeOpacity="0.85"
      />

      {/* Left Code Bracket < */}
      <path
        d="M21 21L12 32L21 43"
        stroke="url(#brandBracketLeft)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Code Bracket > */}
      <path
        d="M43 21L52 32L43 43"
        stroke="url(#brandBracketRight)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central AI Star Nexus */}
      <path
        d="M32 17L35.2 28.8L47 32L35.2 35.2L32 47L28.8 35.2L17 32L28.8 28.8Z"
        fill="url(#brandCoreStar)"
        filter="url(#brandGlow)"
      />
      <circle cx="32" cy="32" r="3.2" fill="#FFFFFF" />
    </svg>
  );
};
