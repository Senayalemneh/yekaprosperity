import React from 'react';
import { useTranslation } from "react-i18next";

function Header() {
  const { t } = useTranslation();

  return (
    <div className='h-36 md:h-48 bg-blue-900 relative text-center flex flex-col justify-center items-center overflow-hidden'>
      <p className='font-bold text-2xl md:text-4xl text-white animate-fadeIn'>
        {t('Structure')}
      </p>
      <p className='font-medium text-lg md:text-2xl text-white mt-2 animate-fadeIn'>
        {t('Structure')}
        <span className="text-gray-300 mx-2">|</span> 
        <a href='/' className='text-blue-900 hover:text-blue-500 transition-colors duration-300'>
          {t('Home')}
        </a>
      </p>
      <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-white rounded-full'></div>
    </div>
  );
}

export default Header;
