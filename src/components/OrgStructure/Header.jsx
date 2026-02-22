import React from 'react';
import { useTranslation } from "react-i18next";

function Header() {
  const { t } = useTranslation();

  return (
    <div className='min-h-48 md:min-h-60 bg-gradient-to-br from-[#136094] via-[#008830] to-[#136094] relative text-center flex flex-col justify-center items-center overflow-hidden py-8'>
      {/* Animated background elements */}
      <div className='absolute inset-0 overflow-hidden'>
        {/* Floating news icons */}
        <div className='absolute top-8 left-10 text-2xl opacity-20 animate-bounce'>📰</div>
        <div className='absolute top-16 right-20 text-xl opacity-25 animate-bounce delay-500'>📢</div>
        <div className='absolute bottom-20 left-20 text-lg opacity-30 animate-bounce delay-700'>✨</div>
        
        {/* Gradient orbs */}
        <div className='absolute -top-12 -left-12 w-32 h-32 bg-[#ffca40] rounded-full opacity-15 animate-pulse'></div>
        <div className='absolute -bottom-16 -right-16 w-40 h-40 bg-[#ffca40] rounded-full opacity-10 animate-ping delay-1000'></div>
      </div>

      {/* News-themed decorative elements */}
      <div className='absolute top-6 left-8 w-3 h-8 bg-[#ffca40] opacity-60 rounded-t-lg'></div>
      <div className='absolute top-6 right-8 w-3 h-8 bg-[#ffca40] opacity-60 rounded-t-lg'></div>
      <div className='absolute bottom-10 left-12 w-2 h-2 bg-white rounded-full opacity-50 animate-pulse'></div>
      <div className='absolute bottom-16 right-16 w-1 h-1 bg-[#ffca40] rounded-full opacity-70'></div>

      <div className='relative z-10 max-w-4xl mx-auto px-4'>
        {/* Main title with news flair */}
        <div className='relative inline-block mb-6'>
          <p className='font-black text-4xl md:text-6xl lg:text-7xl text-white mb-4 animate-fadeIn relative z-10'>
            {t("latestnewsh.orgstructure")}
          </p>
          {/* News headline underline effect */}
          <div className='absolute bottom-2 left-0 w-full h-3 bg-[#ffca40] opacity-40 rounded-full transform -rotate-1 z-0'></div>
        </div>
        
        {/* News content box */}
        <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl animate-fadeInUp'>
          <div className='flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8'>
            <div className='flex items-center'>
              <div className='w-3 h-3 bg-[#ffca40] rounded-full mr-3 animate-pulse'></div>
              <p className='font-bold text-xl md:text-2xl text-white'>
                {t("latestnewsh.orgstructure")}
              </p>
            </div>
            
            {/* Separator - news style */}
            <div className='hidden md:block w-1 h-8 bg-[#ffca40] opacity-60 rounded-full'></div>
            
            {/* Home button with newspaper theme */}
            <a
              href='/'
              className='group relative px-8 py-3 bg-[#ffca40] text-[#136094] font-bold rounded-xl hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-[#008830]'
            >
              <span className='relative z-10 flex items-center'>
                <span className='mr-2'>🏠</span>
                {t("latestnewsh.home")}
              </span>
              {/* Hover effect */}
              <div className='absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300'></div>
              {/* Newspaper fold effect */}
              <div className='absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#008830] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tr-xl'></div>
            </a>
          </div>
        </div>
      </div>

      {/* Breaking news ticker effect at bottom */}
      <div className='absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-transparent via-[#ffca40] to-transparent opacity-70'>
        <div className='absolute inset-0 bg-[#ffca40] opacity-20 animate-pulse'></div>
      </div>
      
      {/* Animated news dots */}
      <div className='absolute inset-0 pointer-events-none'>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1.5 h-1.5 bg-[#ffca40] rounded-full opacity-70 animate-float`}
            style={{
              left: `${15 + i * 10}%`,
              top: `${20 + (i % 4) * 15}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + i * 0.3}s`
            }}
          ></div>
        ))}
      </div>

      {/* Newspaper corner folds */}
      <div className='absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#ffca40] opacity-40 rounded-tl-lg'></div>
      <div className='absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#ffca40] opacity-40 rounded-tr-lg'></div>
    </div>
  );
}

export default Header;