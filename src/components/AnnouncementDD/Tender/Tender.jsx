import React from "react";
import { useTranslation } from "react-i18next";

function Header() {
  const { t } = useTranslation();

  return (
    <div className="min-h-52 md:min-h-68 bg-gradient-to-br from-[#136094] via-[#008830] to-[#136094] relative text-center flex flex-col justify-center items-center overflow-hidden py-10">
      {/* Tender Document Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Document Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-8 grid-rows-6 h-full">
            {[...Array(48)].map((_, i) => (
              <div key={i} className="border-r border-b border-[#ffca40]"></div>
            ))}
          </div>
        </div>

        {/* Stamp/Seal Elements */}
        <div className="absolute top-1/4 left-1/4 w-24 h-24 border-4 border-[#ffca40] rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 border-4 border-[#ffca40] rounded-full opacity-15 transform rotate-45"></div>

        {/* Document Corners */}
        <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-[#ffca40] opacity-30 rounded-tl-lg"></div>
        <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-[#ffca40] opacity-30 rounded-tr-lg"></div>
      </div>

      {/* Tender Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-2xl opacity-25 animate-bounce">
          📄
        </div>
        <div className="absolute bottom-24 right-24 text-xl opacity-30 animate-pulse delay-500">
          📊
        </div>
        <div className="absolute top-32 right-32 text-lg opacity-20 animate-bounce delay-700">
          ⚖️
        </div>
        <div className="absolute bottom-32 left-32 text-lg opacity-25 animate-pulse delay-300">
          📝
        </div>
      </div>

      {/* Document Clips */}
      <div className="absolute top-6 left-6 w-8 h-4 bg-[#ffca40] rounded-t-lg opacity-50 transform -rotate-45"></div>
      <div className="absolute top-6 right-6 w-8 h-4 bg-[#ffca40] rounded-t-lg opacity-50 transform rotate-45"></div>
      <div className="absolute bottom-6 left-6 w-8 h-4 bg-[#ffca40] rounded-b-lg opacity-50 transform rotate-45"></div>
      <div className="absolute bottom-6 right-6 w-8 h-4 bg-[#ffca40] rounded-b-lg opacity-50 transform -rotate-45"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Main Tender Title */}
        <div className="relative mb-6">
          <p className="font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-4 animate-fadeIn tracking-tight">
            {t("tenderh.title")}
          </p>
          {/* Document Underline */}
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-64 h-2 bg-[#ffca40] opacity-60 rounded-full"></div>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-72 h-1 bg-white opacity-30 rounded-full"></div>
        </div>

        {/* Tender Content Document */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 md:p-8 border-2 border-white/20 shadow-2xl animate-fadeInUp">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {/* Breadcrumb with Document Icon */}
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#ffca40] rounded-sm mr-3 animate-pulse flex items-center justify-center">
                <div className="w-2 h-0.5 bg-white"></div>
              </div>
              <p className="font-medium text-xl md:text-2xl text-white">
                {t("tenderh.breadcrumbTender")}
              </p>
            </div>

            {/* Official Separator */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="w-1 h-8 bg-[#ffca40] opacity-60 rounded-full"></div>
              <div className="w-2 h-2 bg-white opacity-40 rounded-full"></div>
              <div className="w-1 h-8 bg-[#ffca40] opacity-60 rounded-full"></div>
            </div>

            {/* Home Button with Stamp Style */}
            <a
              href="/"
              className="group relative px-8 py-3 bg-transparent border-2 border-[#ffca40] text-white font-semibold rounded-lg hover:bg-[#ffca40] hover:text-[#136094] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="relative z-10 flex items-center">
                <span className="mr-2 transition-transform duration-300 group-hover:scale-110">
                  🏠
                </span>
                {t("tenderh.home")}
              </span>
              {/* Stamp Hover Effect */}
              <div className="absolute inset-0 bg-[#ffca40] opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
              {/* Official Seal */}
              <div className="absolute -right-2 -top-2 w-6 h-6 border-2 border-[#ffca40] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Document Edge */}
      <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-[#136094] via-[#ffca40] to-[#008830] opacity-80">
        <div className="absolute inset-0 flex justify-between px-16">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-0.5 h-3 bg-white opacity-40 animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Floating Document Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-3 h-4 bg-[#ffca40] opacity-20 animate-float rounded-sm`}
            style={{
              left: `${8 + i * 10}%`,
              top: `${18 + (i % 5) * 16}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${6 + i * 0.5}s`,
              transform: `rotate(${i * 36}deg)`,
            }}
          ></div>
        ))}
      </div>

      {/* Document Perforations */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-1 flex justify-between">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-1 h-1 bg-[#ffca40] rounded-full opacity-40"
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Header;
