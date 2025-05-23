import React from 'react';

export type TabOption = {
  id: string;
  name: string;
  icon?: React.ReactNode;
};

type TabNavigationProps = {
  tabs: TabOption[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
};

export default function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  size = 'md',
  fullWidth = false,
  className = '',
}: TabNavigationProps) {
  // Size variations
  const sizeClasses = {
    xs: 'px-3 py-1 text-xs gap-1',
    sm: 'px-4 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2 text-sm gap-2',
    lg: 'px-[30px] py-5 text-sm gap-2',
  };

  return (
    <div className={`inline-flex bg-[#134F14] p-1 rounded-full ${fullWidth ? 'w-full' : ''} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            flex items-center ${sizeClasses[size]} rounded-full font-medium transition-all
            ${fullWidth ? 'flex-1 justify-center' : ''}
            ${activeTab === tab.id
              ? 'bg-white text-[#134F14]'
              : 'text-white hover:bg-[#1a6c1b]'
            }
          `}
        >
          {tab.icon && tab.icon}
          <span>{tab.name}</span>
        </button>
      ))}
    </div>
  );
}