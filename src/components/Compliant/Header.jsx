import React from "react";
import { useTranslation } from "react-i18next";

function Header() {
  const { t } = useTranslation();

  return (
    <div className="min-h-52 md:min-h-68 bg-gradient-to-br from-[#136094] via-[#008830] to-[#136094] relative text-center flex flex-col justify-center items-center overflow-hidden py-10">
      {/* Compliance Structure Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern - Representing Structure */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 grid-rows-8 h-full">
            {[...Array(96)].map((_, i) => (
              <div key={i} className="border-r border-b border-[#ffca40]"></div>
            ))}
          </div>
        </div>

        {/* Shield Protection Elements */}
        <div className="absolute top-1/3 left-1/4 w-16 h-20 border-4 border-[#ffca40] rounded-full opacity-10 transform rotate-45"></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-16 border-4 border-[#ffca40] rounded-full opacity-10 transform -rotate-45"></div>

        {/* Compliance Orbs */}
        <div className="absolute top-20 left-20 w-8 h-8 bg-[#ffca40] rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute bottom-24 right-24 w-6 h-6 bg-[#ffca40] rounded-full opacity-10 animate-ping delay-1000"></div>
      </div>

      {/* Compliance Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-24 text-2xl opacity-20 animate-bounce">
          🛡️
        </div>
        <div className="absolute bottom-28 right-28 text-xl opacity-25 animate-pulse delay-500">
          📋
        </div>
        <div className="absolute top-32 right-32 text-lg opacity-15 animate-bounce delay-700">
          ✅
        </div>
        <div className="absolute bottom-32 left-32 text-lg opacity-20 animate-pulse delay-300">
          ⚖️
        </div>
      </div>

      {/* Security Corner Elements */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[#ffca40] opacity-50 rounded-tl-lg"></div>
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[#ffca40] opacity-50 rounded-tr-lg"></div>
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#ffca40] opacity-50 rounded-bl-lg"></div>
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-[#ffca40] opacity-50 rounded-br-lg"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Main Compliance Title */}
        <div className="relative mb-6">
          <p className="font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-4 animate-fadeIn tracking-tight">
            {t("complianth.title")}
          </p>
          {/* Shield Underline */}
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-56 h-2 bg-[#ffca40] opacity-60 rounded-full"></div>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-white opacity-20 rounded-full"></div>
        </div>

        {/* Compliance Content Box */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 border-2 border-white/20 shadow-2xl animate-fadeInUp">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {/* Subtitle with Checkmark */}
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#ffca40] rounded-full mr-3 animate-pulse flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="font-medium text-xl md:text-2xl text-white">
                {t("complianth.subtitle")}
              </p>
            </div>

            {/* Compliance Separator */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="w-1 h-8 bg-[#ffca40] opacity-60 rounded-full"></div>
              <div className="w-2 h-2 bg-white opacity-40 rounded-full"></div>
              <div className="w-1 h-8 bg-[#ffca40] opacity-60 rounded-full"></div>
            </div>

            {/* Home Button with Shield Style */}
            <a
              href="/"
              className="group relative px-8 py-3 bg-[#ffca40] text-[#136094] font-bold rounded-lg hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-transparent hover:border-[#008830]"
            >
              <span className="relative z-10 flex items-center">
                <span className="mr-2 transition-transform duration-300 group-hover:scale-110">
                  🏠
                </span>
                {t("complianth.home")}
              </span>
              {/* Shield Hover Effect */}
              <div className="absolute inset-0 border-2 border-white opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-300"></div>
              {/* Protection Glow */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-500"></div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Compliance Bar */}
      <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-[#136094] via-[#ffca40] to-[#008830] opacity-80">
        <div className="absolute inset-0 flex justify-between px-12">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-0.5 h-3 bg-white opacity-40 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Floating Security Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1.5 h-1.5 bg-[#ffca40] rounded-full opacity-30 animate-float`}
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 4) * 15}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${5 + i * 0.5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Protection Lines */}
      <div className="absolute top-0 left-1/4 w-0.5 h-16 bg-gradient-to-b from-[#ffca40] to-transparent opacity-30"></div>
      <div className="absolute top-0 right-1/4 w-0.5 h-16 bg-gradient-to-b from-[#ffca40] to-transparent opacity-30"></div>
      <div className="absolute bottom-0 left-1/3 w-0.5 h-16 bg-gradient-to-t from-[#ffca40] to-transparent opacity-30"></div>
      <div className="absolute bottom-0 right-1/3 w-0.5 h-16 bg-gradient-to-t from-[#ffca40] to-transparent opacity-30"></div>
    </div>
  );
}

export default Header;
