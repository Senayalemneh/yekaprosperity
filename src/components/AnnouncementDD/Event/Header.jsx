import React from "react";
import { useTranslation } from "react-i18next";

function Header() {
  const { t } = useTranslation();

  return (
    <div className="min-h-52 md:min-h-68 bg-gradient-to-br from-[#136094] via-[#008830] to-[#136094] relative text-center flex flex-col justify-center items-center overflow-hidden py-10">
      {/* Event Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Celebration Confetti */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-4 bg-[#ffca40] rounded-sm transform rotate-${i * 25} animate-bounce`}
              style={{
                left: `${10 + i * 6}%`,
                top: `${15 + (i % 5) * 15}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${2 + (i % 3)}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Event Stage Circles */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 border-4 border-[#ffca40] rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 border-4 border-[#ffca40] rounded-full opacity-10 animate-ping delay-1500"></div>
        
        {/* Spotlights */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#ffca40] to-transparent opacity-5"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#ffca40] to-transparent opacity-5"></div>
      </div>

      {/* Event Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-3xl opacity-25 animate-bounce">🎉</div>
        <div className="absolute bottom-24 right-24 text-2xl opacity-30 animate-pulse delay-300">📅</div>
        <div className="absolute top-32 right-32 text-xl opacity-20 animate-bounce delay-700">🎊</div>
        <div className="absolute bottom-32 left-32 text-xl opacity-25 animate-pulse delay-500">🌟</div>
      </div>

      {/* Stage Corner Lights */}
      <div className="absolute top-6 left-6 w-4 h-4 bg-[#ffca40] rounded-full opacity-60 animate-ping"></div>
      <div className="absolute top-6 right-6 w-4 h-4 bg-[#ffca40] rounded-full opacity-60 animate-ping delay-200"></div>
      <div className="absolute bottom-6 left-6 w-4 h-4 bg-[#ffca40] rounded-full opacity-60 animate-ping delay-400"></div>
      <div className="absolute bottom-6 right-6 w-4 h-4 bg-[#ffca40] rounded-full opacity-60 animate-ping delay-600"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Main Event Title */}
        <div className="relative mb-6">
          <p className="font-black text-4xl md:text-5xl lg:text-6xl text-white mb-4 animate-fadeIn tracking-wide">
            {t("eventh.title")}
          </p>
          {/* Stage Underline */}
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-transparent via-[#ffca40] to-transparent opacity-70 rounded-full"></div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-40 h-0.5 bg-white opacity-50 rounded-full"></div>
        </div>
        
        {/* Event Content Stage */}
        <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 md:p-8 border-2 border-white/25 shadow-2xl animate-fadeInUp">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {/* Events Text with Calendar Icon */}
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#ffca40] rounded-full mr-3 animate-pulse flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              </div>
              <p className="font-semibold text-xl md:text-2xl text-white">
                {t("eventh.events")}
              </p>
            </div>
            
            {/* Celebration Separator */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#ffca40] rounded-full opacity-60 animate-bounce"></div>
              <div className="w-1 h-1 bg-white rounded-full opacity-40"></div>
              <div className="w-2 h-2 bg-[#ffca40] rounded-full opacity-60 animate-bounce delay-150"></div>
              <div className="w-1 h-1 bg-white rounded-full opacity-40"></div>
              <div className="w-2 h-2 bg-[#ffca40] rounded-full opacity-60 animate-bounce delay-300"></div>
            </div>
            
            {/* Home Button with Party Style */}
            <a
              href="/"
              className="group relative px-8 py-3 bg-[#ffca40] text-[#136094] font-bold rounded-xl hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-[#008830]"
            >
              <span className="relative z-10 flex items-center">
                <span className="mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">🏠</span>
                {t("eventh.home")}
              </span>
              {/* Party Hover Effect */}
              <div className="absolute inset-0 border-2 border-white opacity-0 group-hover:opacity-30 rounded-xl transition-opacity duration-300"></div>
              {/* Celebration Sparkle */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Event Marquee */}
      <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-transparent via-[#ffca40] to-transparent opacity-70">
        <div className="absolute inset-0 flex justify-center space-x-16">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-3 bg-white opacity-60 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Floating Celebration Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-[#ffca40] rounded-full opacity-50 animate-float`}
            style={{
              left: `${5 + i * 8}%`,
              top: `${10 + (i % 6) * 15}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + i * 0.3}s`,
              transform: `rotate(${i * 30}deg)`
            }}
          ></div>
        ))}
      </div>

      {/* Stage Lights */}
      <div className="absolute top-0 left-1/3 w-0.5 h-20 bg-gradient-to-b from-[#ffca40] to-transparent opacity-40 animate-pulse"></div>
      <div className="absolute top-0 right-1/3 w-0.5 h-20 bg-gradient-to-b from-[#ffca40] to-transparent opacity-40 animate-pulse delay-500"></div>
      <div className="absolute top-0 left-2/3 w-0.5 h-16 bg-gradient-to-b from-[#ffca40] to-transparent opacity-30 animate-pulse delay-700"></div>
      <div className="absolute top-0 right-2/3 w-0.5 h-16 bg-gradient-to-b from-[#ffca40] to-transparent opacity-30 animate-pulse delay-300"></div>
    </div>
  );
}

export default Header;