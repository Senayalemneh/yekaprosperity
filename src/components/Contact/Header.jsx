import React from 'react';
import { useTranslation } from "react-i18next";

function Header() {
  const { t } = useTranslation();

  return (
    <div className='min-h-52 md:min-h-68 bg-gradient-to-br from-[#136094] via-[#008830] to-[#136094] relative text-center flex flex-col justify-center items-center overflow-hidden py-10'>
      {/* Communication Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        {/* Connection Lines */}
        <div className='absolute inset-0 opacity-10'>
          <div className='grid grid-cols-6 grid-rows-4 gap-8 h-full'>
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className='border border-[#ffca40] rounded-full animate-pulse'
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Signal Waves */}
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-[#ffca40] rounded-full opacity-5 animate-ping'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-2 border-[#ffca40] rounded-full opacity-3 animate-ping delay-700'></div>
        
        {/* Contact Orbs */}
        <div className='absolute top-1/4 left-1/4 w-12 h-12 bg-[#ffca40] rounded-full opacity-20 animate-bounce'></div>
        <div className='absolute bottom-1/3 right-1/3 w-8 h-8 bg-[#ffca40] rounded-full opacity-15 animate-bounce delay-500'></div>
      </div>

      {/* Contact Icons */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-16 left-20 text-3xl opacity-20 animate-bounce'>📱</div>
        <div className='absolute bottom-24 right-24 text-2xl opacity-25 animate-pulse delay-300'>📧</div>
        <div className='absolute top-32 right-32 text-xl opacity-15 animate-bounce delay-1000'>📍</div>
        <div className='absolute bottom-32 left-32 text-xl opacity-20 animate-pulse delay-700'>💬</div>
      </div>

      {/* Connection Dots */}
      <div className='absolute top-6 left-6 w-3 h-3 bg-[#ffca40] rounded-full opacity-60 animate-ping'></div>
      <div className='absolute top-6 right-6 w-3 h-3 bg-[#ffca40] rounded-full opacity-60 animate-ping delay-300'></div>
  <div className='absolute bottom-6 left-6 w-3 h-3 bg-[#ffca40] rounded-full opacity-60 animate-ping delay-500'></div>
      <div className='absolute bottom-6 right-6 w-3 h-3 bg-[#ffca40] rounded-full opacity-60 animate-ping delay-700'></div>

      <div className='relative z-10 max-w-5xl mx-auto px-6'>
        {/* Main Contact Title */}
        <div className='relative mb-6'>
          <p className='font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-4 animate-fadeIn tracking-wide'>
            {t('contacth.title')}
          </p>
          {/* Connection Underline */}
          <div className='absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#ffca40] to-transparent opacity-70 rounded-full'></div>
          <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-40 h-0.5 bg-white opacity-40 rounded-full'></div>
        </div>
        
        {/* Contact Content Panel */}
        <div className='bg-white/15 backdrop-blur-lg rounded-2xl p-6 md:p-8 border-2 border-white/25 shadow-2xl animate-fadeInUp'>
          <div className='flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8'>
            {/* Contact Details with Icon */}
            <div className='flex items-center'>
              <div className='w-4 h-4 bg-[#ffca40] rounded-full mr-3 animate-pulse'></div>
              <p className='font-semibold text-xl md:text-2xl text-white'>
                {t('contacth.contactDetails')}
              </p>
            </div>
            
            {/* Connection Separator */}
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 bg-[#ffca40] rounded-full opacity-60 animate-pulse'></div>
              <div className='w-1 h-1 bg-white rounded-full opacity-40'></div>
              <div className='w-2 h-2 bg-[#ffca40] rounded-full opacity-60 animate-pulse delay-300'></div>
              <div className='w-1 h-1 bg-white rounded-full opacity-40'></div>
              <div className='w-2 h-2 bg-[#ffca40] rounded-full opacity-60 animate-pulse delay-600'></div>
            </div>
            
            {/* Home Button with Contact Style */}
            <a
              href='/'
              className='group relative px-8 py-3 bg-transparent border-2 border-[#ffca40] text-white font-semibold rounded-xl hover:bg-[#ffca40] hover:text-[#136094] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'
            >
              <span className='relative z-10 flex items-center'>
                <span className='mr-2 transition-transform duration-300 group-hover:scale-110'>🏠</span>
                {t('contacth.home')}
              </span>
              {/* Connection Hover Effect */}
              <div className='absolute inset-0 bg-[#ffca40] opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300'></div>
              {/* Signal Wave on Hover */}
              <div className='absolute inset-0 border-2 border-[#ffca40] rounded-xl opacity-0 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500'></div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Communication Bar */}
      <div className='absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#ffca40] to-transparent opacity-70'>
        <div className='absolute inset-0 flex justify-center space-x-12'>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className='w-3 h-2 bg-white opacity-50 rounded-full animate-pulse'
              style={{ animationDelay: `${i * 0.4}s` }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Floating Communication Elements */}
      <div className='absolute inset-0 pointer-events-none'>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-[#ffca40] rounded-full opacity-40 animate-float`}
            style={{
              left: `${8 + i * 8}%`,
              top: `${15 + (i % 6) * 12}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + i * 0.4}s`
            }}
          ></div>
        ))}
      </div>

      {/* Signal Connection Lines */}
      <div className='absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-gradient-to-b from-[#ffca40] to-transparent opacity-40'></div>
      <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-gradient-to-t from-[#ffca40] to-transparent opacity-40'></div>
    </div>
  );
}

export default Header;