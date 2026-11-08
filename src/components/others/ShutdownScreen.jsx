import React from "react";
import { useTranslation } from "react-i18next";

const ShutdownScreen = () => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
            {/* You can add your logo here if you want */}
           <img src="/icon.svg" alt="App Icon" className="w-24 h-24 opacity-80" />
        </div>
        <h1 className="text-3xl font-bold mb-4">
          {t("appCommon.shutdown_title", "App is Currently Closed")}
        </h1>
        <p className="text-lg text-gray-300">
          {t("appCommon.shutdown_message", "We have closed the app for maintenance. Please check back later.")}
        </p>
      </div>
    </div>
  );
};

export default ShutdownScreen;
