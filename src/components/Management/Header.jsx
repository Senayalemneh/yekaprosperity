import React from "react";

function Header() {
  return (
    <div className="h-48 md:h-64 bg-blue-900 relative text-center flex flex-col justify-center items-center">
      <p className="font-bold text-3xl md:text-6xl text-white animate-fadeIn">
        Management
      </p>
      <p className="font-bold text-2xl md:text-4xl text-white mt-2 md:mt-4 animate-fadeIn">
        Management |{" "}
        <a
          href="/"
          className="text-blue-900 hover:text-blue-500 transition-colors duration-300"
        >
          <span>Home</span>
        </a>
      </p>
      <div className="absolute bottom-0 left-0 right-0 h-1 "></div>
    </div>
  );
}

export default Header;
