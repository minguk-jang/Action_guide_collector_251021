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
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 backdrop-blur-sm ${
        hoverable ? 'hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer hover:border-purple-200' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
