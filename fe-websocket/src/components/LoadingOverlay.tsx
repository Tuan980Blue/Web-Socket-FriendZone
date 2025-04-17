import React from 'react';
import { Loader } from '@mantine/core';
import { useTheme } from 'next-themes';

const LoadingOverlay: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`p-8 rounded-xl shadow-2xl flex flex-col items-center 
        ${theme === 'dark' ? 'bg-[#121212] border border-[#262626]' : 'bg-white border border-[#DBDBDB]'}`}>
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] animate-spin blur-xl opacity-20"></div>
          <Loader 
            size="xl" 
            className="relative z-10"
            styles={{
              root: {
                '--loader-color': 'linear-gradient(45deg, #F58529, #DD2A7B, #515BD4)',
              }
            }}
          />
        </div>
        <div className="mt-6 text-center">
          <h3 className={`text-lg font-semibold mb-2 
            ${theme === 'dark' ? 'text-[#FAFAFA]' : 'text-[#262626]'}`}>
            Đang tải...
          </h3>
          <p className={`text-sm 
            ${theme === 'dark' ? 'text-[#8E8E8E]' : 'text-[#666666]'}`}>
            Vui lòng đợi trong giây lát
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay; 