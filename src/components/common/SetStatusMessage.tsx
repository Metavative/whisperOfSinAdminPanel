"use client";

import React from 'react';

interface StatusMessageProps {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string | null;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ status, message }) => {
  if (status === 'idle' || !message) {
    return null; // Don't render anything if idle or no message
  }

  let bgColor = 'bg-blue-100 dark:bg-blue-900';
  let textColor = 'text-blue-700 dark:text-blue-300';
  let borderColor = 'border-blue-300 dark:border-blue-700';
  let icon = null;

  switch (status) {
    case 'loading':
      bgColor = 'bg-blue-100 dark:bg-blue-900';
      textColor = 'text-blue-700 dark:text-blue-300';
      borderColor = 'border-blue-300 dark:border-blue-700';
      icon = (
        <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
      break;
    case 'success':
      bgColor = 'bg-green-100 dark:bg-green-900';
      textColor = 'text-green-700 dark:text-green-300';
      borderColor = 'border-green-300 dark:border-green-700';
      icon = (
        <svg className="h-5 w-5 mr-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
      break;
    case 'error':
      bgColor = 'bg-red-100 dark:bg-red-900';
      textColor = 'text-red-700 dark:text-red-300';
      borderColor = 'border-red-300 dark:border-red-700';
      icon = (
        <svg className="h-5 w-5 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
      break;
  }

  return (
    <div
      className={`flex items-center p-4 rounded-lg border ${bgColor} ${textColor} ${borderColor} shadow-md mb-4`}
      role="status"
      aria-live="polite" // Announce changes to screen readers
    >
      {icon}
      <p className="font-medium">{message}</p>
    </div>
  );
};

export default StatusMessage;