import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md border border-gray-200 ${
        hoverable ? 'hover:shadow-lg transition-shadow cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
