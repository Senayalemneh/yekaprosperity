import React from "react";
import { useTranslation } from "react-i18next";

function Header() {
  const { t } = useTranslation();

  return (
    <div className="min-h-52 md:min-h-68 bg-gradient-to-br from-[#136094] via-[#008830] to-[#136094] relative text-center flex flex-col justify-center items-center overflow-hidden py-10">
      {/* Executive Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Corporate Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-8 grid-rows-6 h-full">
            {[...Array(48)].map((_, i) => (
              <div key={i} className="border-r border-b border-[#ffca40]"></div>
            ))}
          </div>
        </div>

        {/* Executive Accents */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ffca40] to-transparent opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-[#ffca40] to-transparent opacity-30"></div>

        {/* Professional Orbs */}
        <div className="absolute top-1/4 -left-8 w-20 h-20 bg-[#ffca40] rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/3 -right-8 w-24 h-24 bg-[#ffca40] rounded-full opacity-5 animate-ping delay-1000"></div>
      </div>

      {/* Leadership Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-12 left-16 text-3xl opacity-15 animate-bounce">
          👔
        </div>
        <div className="absolute bottom-20 right-20 text-2xl opacity-20 animate-pulse delay-500">
          💼
        </div>
        <div className="absolute top-1/2 left-20 text-xl opacity-10 animate-bounce delay-700">
          ⭐
        </div>
      </div>

      {/* Corner Executive Elements */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[#ffca40] opacity-50 rounded-tl-lg"></div>
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[#ffca40] opacity-50 rounded-tr-lg"></div>
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#ffca40] opacity-50 rounded-bl-lg"></div>
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-[#ffca40] opacity-50 rounded-br-lg"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Main CEO Title */}
        <div className="relative mb-6">
          <p className="font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-4 animate-fadeIn tracking-tight">
            {t("ceopageh.title")}
          </p>
          {/* Executive Underline */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#ffca40] to-transparent opacity-70 rounded-full"></div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-white opacity-40 rounded-full"></div>
        </div>

        {/* Professional Content Box */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 border border-white/20 shadow-2xl animate-fadeInUp">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {/* Subtitle with Professional Marker */}
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#ffca40] rounded-full mr-3 animate-pulse"></div>
              <p className="font-medium text-lg md:text-2xl text-white">
                {t("ceopageh.subtitle")}
              </p>
            </div>

            {/* Executive Separator */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-1 h-6 bg-[#ffca40] opacity-60 rounded-full"></div>
              <div className="w-1 h-4 bg-white opacity-40 rounded-full"></div>
              <div className="w-1 h-6 bg-[#ffca40] opacity-60 rounded-full"></div>
            </div>

            {/* Home Button with Professional Style */}
            <a
              href="/"
              className="group relative px-8 py-3 bg-transparent border-2 border-[#ffca40] text-white font-semibold rounded-lg hover:bg-[#ffca40] hover:text-[#136094] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="relative z-10 flex items-center">
                <span className="mr-2 transition-transform duration-300 group-hover:scale-110">
                  🏠
                </span>
                {t("ceopageh.home")}
              </span>
              {/* Professional Hover Effect */}
              <div className="absolute inset-0 bg-[#ffca40] opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Executive Bar */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#136094] via-[#ffca40] to-[#008830] opacity-80">
        <div className="absolute inset-0 flex justify-between px-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-0.5 h-2 bg-white opacity-30 animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Floating Leadership Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1.5 h-1.5 bg-[#ffca40] rounded-full opacity-40 animate-float`}
            style={{
              left: `${15 + i * 12}%`,
              top: `${25 + (i % 4) * 12}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${6 + i * 0.5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Signature Line Effect */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-64 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
    </div>
  );
}

export default Header;
