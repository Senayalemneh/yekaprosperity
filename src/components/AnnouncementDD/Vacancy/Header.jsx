import React from "react";
import { useTranslation } from "react-i18next";

function Header() {
  const { t } = useTranslation();

  return (
    <div className="min-h-52 md:min-h-68 bg-gradient-to-br from-[#136094] via-[#008830] to-[#136094] relative text-center flex flex-col justify-center items-center overflow-hidden py-10">
      {/* Career Path Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Career Ladder Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full flex flex-col justify-between py-12">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-full h-1 bg-[#ffca40] transform"
                style={{ marginLeft: `${i * 20}px` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Growth Orbs */}
        <div className="absolute top-1/4 -left-6 w-16 h-16 bg-[#ffca40] rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute bottom-1/3 -right-8 w-20 h-20 bg-[#ffca40] rounded-full opacity-10 animate-ping delay-1000"></div>

        {/* Career Progress Dots */}
        <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-[#ffca40] rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-[#ffca40] rounded-full opacity-30 animate-bounce delay-500"></div>
      </div>

      {/* Career Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-2xl opacity-25 animate-bounce">
          💼
        </div>
        <div className="absolute bottom-24 right-24 text-xl opacity-30 animate-pulse delay-300">
          🚀
        </div>
        <div className="absolute top-32 right-32 text-lg opacity-20 animate-bounce delay-700">
          👨‍💼
        </div>
        <div className="absolute bottom-32 left-32 text-lg opacity-25 animate-pulse delay-500">
          📈
        </div>
      </div>

      {/* Career Milestone Markers */}
      <div className="absolute top-6 left-6 w-4 h-4 border-2 border-[#ffca40] rounded-full opacity-50 animate-ping"></div>
      <div className="absolute top-6 right-6 w-4 h-4 border-2 border-[#ffca40] rounded-full opacity-50 animate-ping delay-200"></div>
      <div className="absolute bottom-6 left-6 w-4 h-4 border-2 border-[#ffca40] rounded-full opacity-50 animate-ping delay-400"></div>
      <div className="absolute bottom-6 right-6 w-4 h-4 border-2 border-[#ffca40] rounded-full opacity-50 animate-ping delay-600"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Main Jobs Title */}
        <div className="relative mb-6">
          <p className="font-black text-4xl md:text-5xl lg:text-6xl text-white mb-4 animate-fadeIn tracking-wide">
            {t("jobh.title")}
          </p>
          {/* Career Path Underline */}
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-56 h-2 bg-gradient-to-r from-transparent via-[#ffca40] to-transparent opacity-70 rounded-full"></div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-48 h-0.5 bg-white opacity-40 rounded-full"></div>
        </div>

        {/* Career Opportunities Panel */}
        <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 md:p-8 border-2 border-white/25 shadow-2xl animate-fadeInUp">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {/* Vacancy Text with Opportunity Marker */}
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#ffca40] rounded-full mr-3 animate-pulse flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              </div>
              <p className="font-semibold text-xl md:text-2xl text-white">
                {t("jobh.vacancy")}
              </p>
            </div>

            {/* Career Path Separator */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#ffca40] rounded-full opacity-60 animate-bounce"></div>
              <div className="w-1 h-1 bg-white rounded-full opacity-40"></div>
              <div className="w-2 h-2 bg-[#ffca40] rounded-full opacity-60 animate-bounce delay-150"></div>
              <div className="w-1 h-1 bg-white rounded-full opacity-40"></div>
              <div className="w-2 h-2 bg-[#ffca40] rounded-full opacity-60 animate-bounce delay-300"></div>
            </div>

            {/* Home Button with Career Growth Style */}
            <a
              href="/"
              className="group relative px-8 py-3 bg-[#ffca40] text-[#136094] font-bold rounded-xl hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-[#008830]"
            >
              <span className="relative z-10 flex items-center">
                <span className="mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  🏠
                </span>
                {t("jobh.home")}
              </span>
              {/* Growth Hover Effect */}
              <div className="absolute inset-0 border-2 border-white opacity-0 group-hover:opacity-30 rounded-xl transition-opacity duration-300"></div>
              {/* Opportunity Spark */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Career Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-transparent via-[#ffca40] to-transparent opacity-70">
        <div className="absolute inset-0 flex justify-center space-x-12">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-white opacity-50 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Floating Opportunity Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-[#ffca40] rounded-full opacity-40 animate-float`}
            style={{
              left: `${10 + i * 8}%`,
              top: `${15 + (i % 6) * 14}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${4 + i * 0.4}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Career Growth Lines */}
      <div className="absolute top-0 left-1/3 w-0.5 h-20 bg-gradient-to-b from-[#ffca40] to-transparent opacity-40"></div>
      <div className="absolute top-0 right-1/3 w-0.5 h-20 bg-gradient-to-b from-[#ffca40] to-transparent opacity-40"></div>
      <div className="absolute bottom-0 left-1/4 w-0.5 h-16 bg-gradient-to-t from-[#ffca40] to-transparent opacity-30"></div>
      <div className="absolute bottom-0 right-1/4 w-0.5 h-16 bg-gradient-to-t from-[#ffca40] to-transparent opacity-30"></div>

      {/* Opportunity Badge */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-[#ffca40] rounded-full opacity-30 animate-pulse flex items-center justify-center">
        <div className="w-4 h-4 bg-white rounded-full opacity-50"></div>
      </div>
    </div>
  );
}

export default Header;
