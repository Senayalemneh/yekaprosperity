import React from 'react';
import { useTranslation } from "react-i18next";

function Header() {
  const { t } = useTranslation();

  return (
    <div className='min-h-48 md:min-h-60 bg-gradient-to-br from-[#136094] via-[#008830] to-[#136094] relative text-center flex flex-col justify-center items-center overflow-hidden py-8'>
      {/* Animated background elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-24 -left-24 w-48 h-48 bg-[#ffca40] rounded-full opacity-20 animate-pulse'></div>
        <div className='absolute -bottom-32 -right-32 w-64 h-64 bg-[#ffca40] rounded-full opacity-15 animate-bounce delay-1000'></div>
        <div className='absolute top-1/2 left-1/4 w-8 h-8 bg-white rounded-full opacity-30 animate-ping'></div>
      </div>
      
      {/* Geometric shapes */}
      <div className='absolute top-4 right-8 w-6 h-6 border-2 border-[#ffca40] rotate-45 opacity-60'></div>
      <div className='absolute bottom-8 left-6 w-4 h-4 border-2 border-white rounded-full opacity-50'></div>
      <div className='absolute top-6 left-12 w-3 h-3 bg-[#ffca40] rotate-12 opacity-70'></div>

      <div className='relative z-10 max-w-4xl mx-auto px-4'>
        <p className='font-bold text-3xl md:text-5xl lg:text-6xl text-white mb-4 animate-fadeIn relative'>
          {t("aboutush.name")}
          {/* Underline effect */}
          <span className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-[#ffca40] rounded-full mt-2'></span>
        </p>
        
        <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20 shadow-2xl animate-fadeInUp'>
          <p className='font-semibold text-lg md:text-2xl text-white mb-3'>
            {t("aboutush.about")}
          </p>
          
          <div className='flex items-center justify-center space-x-4'>
            <span className="w-2 h-2 bg-[#ffca40] rounded-full animate-pulse"></span>
            <a
              href='/'
              className='group relative px-6 py-2 bg-[#ffca40] text-[#136094] font-bold rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'
            >
              {t("aboutush.home")}
              {/* Hover effect */}
              <span className='absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300'></span>
            </a>
            <span className="w-2 h-2 bg-[#ffca40] rounded-full animate-pulse delay-300"></span>
          </div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className='absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#ffca40] to-transparent opacity-80'></div>
      
      {/* Floating particles */}
      <div className='absolute inset-0 pointer-events-none'>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-[#ffca40] rounded-full opacity-60 animate-float`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Header;