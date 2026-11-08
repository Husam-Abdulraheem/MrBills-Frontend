import { useState } from "react";
import { useTranslation } from "react-i18next";

function SureDialogSubscription(props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative inline-flex items-center justify-center px-6 py-3 font-bold text-gray-900 uppercase transition-all duration-300 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg shadow-md hover:from-yellow-500 hover:to-yellow-600 hover:shadow-lg active:shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 hover:-translate-y-0.5"
      >
        {t("sureDialog.startFreeTrial", "Start free trial")}
        {/* تأثير لامع عند التحويم */}
        <span className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg">
          <span className="absolute inset-0 w-full h-full transition-all duration-300 bg-white opacity-0 hover:opacity-10 active:opacity-5"></span>
        </span>
      </button>

      {isOpen && (
        <>
          {/* Transparent background with blur effect */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-40 flex items-center justify-center p-4 transition-opacity duration-300"
          >
            {/* Dialog */}
            <div className="relative bg-[var(--dark)] rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-95 animate-in fade-in-90 zoom-in-90">
              <div className="relative z-10 p-6">
                <div className="text-center mb-6">

                  <h2 className="text-2xl font-bold text-white mb-2">
                    {t("sureDialog.areYouSure", "Are you sure?")}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {t("sureDialog.confirmTrial", "Do you want to start your free trial?")}
                  </p>
                </div>
                
                <div className="flex justify-center space-x-4 mt-6">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                  >
                    {t("sureDialog.cancel", "Cancel")}
                  </button>
                  <button
                    onClick={() => props?.func(props?.pack)}
                    className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 shadow-md hover:shadow-lg"
                  >
                    {t("sureDialog.yes", "Yes")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default SureDialogSubscription;