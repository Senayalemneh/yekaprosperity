import React from "react";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full bg-opacity-50">
      <div className="loader-container">
        <div className="loader"></div>
      </div>

      <style jsx>{`
        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          width: 120px;
          height: 120px;
        }

        .loader {
          width: 100px;
          height: 100px;
          border: 6px solid rgba(255, 255, 255, 0.3);
          border-top: 6px solid #facc15; /* Golden Yellow */
          border-right: 6px solid #005bba; /* Deep Blue */
          border-bottom: 6px solid #e11d48; /* Vibrant Red */
          border-left: 6px solid #16a34a; /* Green */
          border-radius: 50%;
          animation: spin 1s linear infinite;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Spinner;
