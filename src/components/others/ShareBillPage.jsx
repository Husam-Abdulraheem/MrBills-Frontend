import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function ShareBillPage() {
  const { t } = useTranslation();
  const [appOpened, setAppOpened] = useState(false);

  const main = "main"; // default

  useEffect(() => {
    const appUrl = `mrbills://main`;
    const start = new Date().getTime();

    const timeout = setTimeout(() => {
      const now = new Date().getTime();
      if (!appOpened && now - start < 1500) {
        setAppOpened("noApp");
      }
    }, 1200);

    window.location.href = appUrl;

    return () => clearTimeout(timeout);
  }, [main, appOpened]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0f0f0e] via-[#171715] to-[#0f0f0e] text-white px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-yellow-700 rounded-full filter blur-3xl"></div>
      </div>

      <div className="z-10 flex flex-col items-center justify-center text-center max-w-md">
        {!appOpened && (
          <div className="w-20 h-20 border-4 border-yellow-500 border-t-transparent rounded-full mb-6 animate-spin"></div>
        )}

        <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
          {appOpened === "noApp" ? t("share.noAppTitle") : t("share.openingApp")}
        </h1>

        {appOpened === "noApp" && (
          <div className="mb-6 px-6 py-4 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-xl shadow-lg border border-red-600 transform transition-transform duration-300 hover:scale-105">
            <div className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p>{t("share.noAppMessage")}</p>
            </div>
          </div>
        )}

        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
          {appOpened === "noApp" 
            ? t("share.installTip")
            : t("share.ifNotOpen")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full mb-8">
          <a
            href={`https://play.google.com/store/apps/details?id=com.mrbills.app`}
            className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold px-6 py-4 rounded-xl shadow-lg transition-all duration-300 hover:from-yellow-400 hover:to-yellow-500 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
            </svg>
            {t("share.downloadApp")}
          </a>

          <a 
            href="/"
            className="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold px-6 py-4 rounded-xl shadow-lg transition-all duration-300 hover:from-gray-700 hover:to-gray-800 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center border border-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
            {t("share.useWeb")}
          </a>
        </div>

        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 border border-gray-700 mt-4">
          <p className="text-sm text-gray-400">{t("share.installAppTip")}</p>
        </div>
      </div>
    </div>
  );
}

export default ShareBillPage;
