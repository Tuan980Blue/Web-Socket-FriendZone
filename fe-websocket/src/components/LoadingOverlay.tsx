import React from 'react';
import { HashLoader } from 'react-spinners';
import { useTheme } from 'next-themes';

const LoadingOverlay: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 bg-black/10 dark:bg-black/20 backdrop-blur-md flex items-center justify-center z-50">
      <div className={`p-8 rounded-2xl shadow-2xl flex flex-col items-center transform transition-all duration-300
        ${theme === 'dark' ? 'bg-[#121212] border border-[#262626]' : 'bg-white border border-[#DBDBDB]'}`}>
        <div className="relative">
          {/* Instagram gradient background */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] animate-spin blur-xl opacity-30"></div>
          {/* Secondary gradient for depth */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] animate-pulse blur-lg opacity-20"></div>
          <HashLoader
            loading={true}
            color="#DD2A7B"
            speedMultiplier={1.2}
            size={50}
          />
        </div>
        <div className="mt-6 text-center">
          <h3 className={`text-lg font-semibold mb-2 bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] bg-clip-text text-transparent`}>
            Đang tải...
          </h3>
          <p className={`text-sm 
            ${theme === 'dark' ? 'text-[#8E8E8E]' : 'text-[#8E8E8E]'}`}>
            Vui lòng đợi trong giây lát
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay; 