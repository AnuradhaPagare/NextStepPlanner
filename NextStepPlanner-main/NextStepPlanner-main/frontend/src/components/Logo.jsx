import React from 'react';

const Logo = ({ className = "", size = "md", showText = true }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="text-blue-500" style={{stopColor: 'currentColor'}} />
              <stop offset="100%" className="text-blue-700" style={{stopColor: 'currentColor'}} />
            </linearGradient>
            <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="text-emerald-500" style={{stopColor: 'currentColor'}} />
              <stop offset="100%" className="text-emerald-600" style={{stopColor: 'currentColor'}} />
            </linearGradient>
          </defs>
          
          {/* Background circle */}
          <circle cx="32" cy="32" r="30" fill="url(#primaryGradient)" stroke="none"/>
          
          {/* Step stairs representing progress */}
          <g fill="white" fillOpacity="0.9">
            {/* Step 1 */}
            <rect x="12" y="45" width="12" height="6" rx="1"/>
            {/* Step 2 */}
            <rect x="20" y="35" width="12" height="6" rx="1"/>
            {/* Step 3 */}
            <rect x="28" y="25" width="12" height="6" rx="1"/>
            {/* Step 4 (highlighted as current/next step) */}
            <rect x="36" y="15" width="12" height="6" rx="1" fill="url(#accentGradient)"/>
          </g>
          
          {/* Arrow pointing forward */}
          <g fill="white" fillOpacity="0.9">
            <path d="M44 32 L50 28 L50 30 L56 30 L56 34 L50 34 L50 36 Z"/>
          </g>
          
          {/* Small dots representing planning/tasks */}
          <g fill="white" fillOpacity="0.6">
            <circle cx="16" cy="42" r="1"/>
            <circle cx="24" cy="32" r="1"/>
            <circle cx="32" cy="22" r="1"/>
          </g>
        </svg>
      </div>
      {showText && (
        <span className="font-bold text-foreground">
          NextStep Planner
        </span>
      )}
    </div>
  );
};

export default Logo;