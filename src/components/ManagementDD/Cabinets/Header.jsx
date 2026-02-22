import React from "react";
import { useTranslation } from "react-i18next";

function Header() {
  const { t } = useTranslation();

  return (
    <div className="min-h-52 md:min-h-68 bg-gradient-to-br from-[#136094] via-[#008830] to-[#136094] relative text-center flex flex-col justify-center items-center overflow-hidden py-10">
      {/* Cabinet Structure Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Cabinet Shelf Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full flex flex-col justify-between py-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-full h-1 bg-[#ffca40] transform -skew-x-12"
              ></div>
            ))}
          </div>
        </div>

        {/* Cabinet Door Effect */}
        <div className="absolute inset-y-0 left-0 w-1/2 border-r-2 border-[#ffca40] opacity-20"></div>
        <div className="absolute inset-y-0 right-0 w-1/2 border-l-2 border-[#ffca40] opacity-20"></div>

        {/* Cabinet Handle Elements */}
        <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 w-8 h-1 bg-[#ffca40] rounded-full opacity-30"></div>
        <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 w-8 h-1 bg-[#ffca40] rounded-full opacity-30"></div>

        {/* Glowing Orbs */}
        <div className="absolute top-1/3 -left-6 w-16 h-16 bg-[#ffca40] rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-6 w-20 h-20 bg-[#ffca40] rounded-full opacity-10 animate-ping delay-1500"></div>
      </div>

      {/* Cabinet Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-20 text-2xl opacity-20 animate-bounce">
          🗄️
        </div>
        <div className="absolute bottom-20 right-24 text-xl opacity-25 animate-pulse delay-700">
          📁
        </div>
        <div className="absolute top-32 right-32 text-lg opacity-15 animate-bounce delay-1000">
          📊
        </div>
        <div className="absolute bottom-32 left-32 text-lg opacity-20 animate-pulse delay-500">
          🔑
        </div>
      </div>

      {/* Cabinet Frame Elements */}
      <div className="absolute top-8 left-8 w-6 h-10 border-2 border-[#ffca40] opacity-40 rounded-sm"></div>
      <div className="absolute top-8 right-8 w-6 h-10 border-2 border-[#ffca40] opacity-40 rounded-sm"></div>
      <div className="absolute bottom-8 left-8 w-10 h-6 border-2 border-[#ffca40] opacity-40 rounded-sm"></div>
      <div className="absolute bottom-8 right-8 w-10 h-6 border-2 border-[#ffca40] opacity-40 rounded-sm"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Main Cabinet Title */}
        <div className="relative mb-6">
          <p className="font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-4 animate-fadeIn tracking-wide">
            {t("cabineth.title")}
          </p>
          {/* Cabinet Shelf Underline */}
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-64 h-2 bg-[#ffca40] opacity-60 rounded-full"></div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-56 h-1 bg-white opacity-30 rounded-full"></div>
        </div>

        {/* Cabinet Content Panel */}
        <div className="bg-white/15 backdrop-blur-lg rounded-xl p-6 md:p-8 border-2 border-white/25 shadow-2xl animate-fadeInUp">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {/* Cabinet Text with Icon */}
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#ffca40] rounded-full mr-3 animate-pulse"></div>
              <p className="font-semibold text-xl md:text-2xl text-white">
                {t("cabineth.title")}
              </p>
            </div>

            {/* Cabinet Handle Separator */}
            <div className="flex items-center space-x-3">
              <div className="w-6 h-1 bg-[#ffca40] opacity-60 rounded-full"></div>
              <div className="w-2 h-2 bg-white opacity-50 rounded-full"></div>
              <div className="w-6 h-1 bg-[#ffca40] opacity-60 rounded-full"></div>
            </div>

            {/* Home Button with Cabinet Style */}
            <a
              href="/"
              className="group relative px-8 py-3 bg-[#ffca40] text-[#136094] font-bold rounded-lg hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-[#008830]"
            >
              <span className="relative z-10 flex items-center">
                <span className="mr-2 transition-transform duration-300 group-hover:scale-110">
                  🏠
                </span>
                {t("cabineth.home")}
              </span>
              {/* Cabinet Door Hover Effect */}
              <div className="absolute inset-0 border-2 border-white opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-300"></div>
              {/* Handle Effect */}
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-[#136094] opacity-0 group-hover:opacity-30 rounded-full transition-opacity duration-300"></div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Cabinet Rail */}
      <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-[#136094] via-[#ffca40] to-[#008830] opacity-80">
        <div className="absolute inset-0 flex justify-around">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-0.5 h-3 bg-white opacity-40 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Floating Document Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-3 bg-[#ffca40] opacity-30 animate-float rounded-sm`}
            style={{
              left: `${12 + i * 9}%`,
              top: `${20 + (i % 5) * 15}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${5 + i * 0.5}s`,
              transform: `rotate(${i * 36}deg)`,
            }}
          ></div>
        ))}
      </div>

      {/* Cabinet Corner Joints */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#ffca40] opacity-50"></div>
      <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#ffca40] opacity-50"></div>
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#ffca40] opacity-50"></div>
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#ffca40] opacity-50"></div>
    </div>
  );
}

export default Header;
