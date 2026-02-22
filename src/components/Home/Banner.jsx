import React from "react";
import logo from "../../assets/4334.png";
import { useTranslation } from "react-i18next";
// import IMG from "../"
function Banner() {
  const { t } = useTranslation();
  return (
    <div>
      <div class="grid md:grid-cols-3 gap-6 min-h-[164px] py-8 p-16 bg-gradient-to-r from-blue-700 to-blue-400 font-sans overflow-hidden">
        <div class="md:col-span-2">
          <h1 class="text-3xl font-bold text-white">
            {t(
              "Thank you for visiting us at Addis Ababa Transport Bureau Bole Branch!"
            )}
          </h1>
          <p class="text-base text-gray-200 mt-4">
            {t("We appreciate your interest and are here to assist you.")}
          </p>
          <a href="/contact">
            <button
              type="button"
              class="py-3 px-6 text-sm font-semibold bg-white text-blue-600 hover:bg-slate-100 rounded-md mt-8"
            >
              {t("Contact Us")}
            </button>
          </a>
        </div>

        <div class="relative max-md:hidden">
          <img
            src={logo}
            alt="Banner Image"
            class="w-full right-4 top-[-13px] md:absolute skew-x-[-16deg] rotate-2 object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Banner;
