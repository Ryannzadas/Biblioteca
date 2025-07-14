import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  description
}) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-400',
    secondary: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900 dark:text-secondary-400',
    accent: 'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-400',
    success: 'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-400',
    warning: 'bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-400',
    danger: 'bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-400'
  };
  
  return (
    <div className="card p-6 h-full">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {value}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {title}
          </p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;