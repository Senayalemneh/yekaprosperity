import React from "react";
import { useTranslation } from "react-i18next";

function Header() {
  const { t } = useTranslation();

  return (
    <div className="min-h-52 md:min-h-64 bg-gradient-to-br from-[#136094] via-[#008830] to-[#136094] relative text-center flex flex-col justify-center items-center overflow-hidden py-8">
      {/* Gallery Grid Background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-4 transform -rotate-6 scale-110">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="border-2 border-[#ffca40] rounded-lg opacity-30 hover:opacity-60 transition-opacity duration-500"
            ></div>
          ))}
        </div>
      </div>

      {/* Floating Photo Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Polaroid Frames */}
        <div className="absolute top-8 left-8 w-16 h-20 bg-white rotate-12 shadow-2xl opacity-40 animate-float">
          <div className="w-full h-12 bg-[#ffca40]"></div>
        </div>
        <div className="absolute bottom-12 right-10 w-14 h-18 bg-white -rotate-6 shadow-2xl opacity-30 animate-float delay-1000">
          <div className="w-full h-10 bg-[#008830]"></div>
        </div>
        <div className="absolute top-20 right-20 w-12 h-16 bg-white rotate-3 shadow-2xl opacity-25 animate-float delay-2000">
          <div className="w-full h-8 bg-[#136094]"></div>
        </div>

        {/* Camera Icon */}
        <div className="absolute bottom-8 left-20 text-2xl opacity-20 animate-bounce delay-1500">
          📸
        </div>
        <div className="absolute top-12 right-16 text-xl opacity-25 animate-pulse">
          🖼️
        </div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute -top-8 -left-8 w-24 h-24 bg-[#ffca40] rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#ffca40] rounded-full opacity-15 animate-ping delay-700"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Main Title with Gallery Flair */}
        <div className="relative inline-block mb-6">
          <p className="font-black text-4xl md:text-6xl lg:text-7xl text-white mb-4 animate-fadeIn relative z-10 tracking-wide">
            {t("galleryh.title")}
          </p>
          {/* Gallery Frame Effect */}
          <div className="absolute -inset-4 border-2 border-[#ffca40] opacity-30 rounded-lg transform rotate-1 z-0"></div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-[#ffca40] rounded-full opacity-60"></div>
        </div>

        {/* Gallery Content Box */}
        <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 md:p-8 border-2 border-white/25 shadow-2xl animate-fadeInUp">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {/* Gallery Text with Icon */}
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#ffca40] rounded-full mr-3 animate-pulse"></div>
              <p className="font-semibold text-xl md:text-2xl text-white">
                {t("galleryh.gallery")}
              </p>
            </div>

            {/* Artistic Separator */}
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-[#ffca40] rounded-full opacity-60"></div>
              <div className="w-2 h-2 bg-[#ffca40] rounded-full opacity-80"></div>
              <div className="w-1 h-1 bg-[#ffca40] rounded-full opacity-60"></div>
            </div>

            {/* Home Button with Gallery Theme */}
            <a
              href="/"
              className="group relative px-8 py-3 bg-[#ffca40] text-[#136094] font-bold rounded-xl hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-[#008830]"
            >
              <span className="relative z-10 flex items-center">
                <span className="mr-2 transition-transform duration-300 group-hover:scale-110">
                  🏠
                </span>
                {t("galleryh.home")}
              </span>
              {/* Polaroid Frame Effect on Hover */}
              <div className="absolute inset-0 border-2 border-white opacity-0 group-hover:opacity-30 rounded-xl transition-opacity duration-300"></div>
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-500 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Gallery Rail */}
      <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-transparent via-[#ffca40] to-transparent opacity-60">
        <div className="absolute inset-0 flex justify-center space-x-8">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-3 bg-white opacity-40 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Floating Gallery Items */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-[#ffca40] rounded-full opacity-50 animate-float`}
            style={{
              left: `${10 + i * 8}%`,
              top: `${15 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${5 + i * 0.4}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Corner Gallery Frames */}
      <div className="absolute top-4 left-4 w-6 h-8 border-2 border-[#ffca40] opacity-40 rounded-sm"></div>
      <div className="absolute top-4 right-4 w-6 h-8 border-2 border-[#ffca40] opacity-40 rounded-sm"></div>
      <div className="absolute bottom-4 left-4 w-8 h-6 border-2 border-[#ffca40] opacity-40 rounded-sm"></div>
      <div className="absolute bottom-4 right-4 w-8 h-6 border-2 border-[#ffca40] opacity-40 rounded-sm"></div>
    </div>
  );
}

export default Header;
