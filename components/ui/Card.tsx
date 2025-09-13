import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  actions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, actions }) => {
  return (
    <div className={`
      bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 
      rounded-xl shadow-lg
      relative overflow-hidden
      ${className}
    `}>
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
      
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-slate-700/50 flex justify-between items-center">
          {title && <h2 className="text-lg font-semibold text-slate-100">{title}</h2>}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-6 relative">
        {children}
      </div>
    </div>
  );
};

export default Card;