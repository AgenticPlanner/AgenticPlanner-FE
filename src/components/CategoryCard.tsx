import React from 'react';
import { type PlanCategory } from '../types';

interface CategoryCardProps {
  category: PlanCategory;
  isActive: boolean;
  onClick: (id: string) => void;
}

export default function CategoryCard({ category, isActive, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={() => onClick(category.id)}
      className={`flex items-center p-2 rounded-[20px] transition-all duration-300 text-left w-full h-[100px] transform hover:scale-[1.02] focus:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500
        ${isActive 
          ? 'bg-[#CCCCCC] dark:bg-gray-600 shadow-md' // 선택된 상태
          : 'bg-[#F4F5F6] hover:bg-[#E5E7EB] dark:bg-gray-800 dark:hover:bg-gray-700 shadow-sm hover:shadow-md' // 기본 상태
        }
      `}
      aria-pressed={isActive}
      aria-label={`Select ${category.title} category`}
    >
      <div className="w-[84px] h-[84px] flex-shrink-0 overflow-hidden rounded-[14px] ml-1 transition-transform duration-300 group-hover:scale-105">
        <img
          src={category.imageUrl}
          alt=""
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          loading="lazy"
          role="presentation"
        />
      </div>
      <span className="ml-6 text-[1.05rem] font-medium text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
        {category.title}
      </span>
    </button>
  );
}