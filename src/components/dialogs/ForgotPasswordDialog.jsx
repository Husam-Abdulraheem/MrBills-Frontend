import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function ForgotPasswordDialog({ onCancel }) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onCancel();
    }, 300); // Match the duration of the fade-out animation
  };

  return (
    <>
      {/* Backdrop with blur effect */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-[999] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      ></div>

      {/* Dialog */}
      <div 
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md p-4 md:p-6 rounded-xl shadow-2xl z-[1000] transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} bg-[var(--dark)] border border-yellow-500/30 flex flex-col`}
      >

        <div className="relative z-10 flex flex-col items-center">
          {/* Icon */}
          <div className="flex justify-center mb-3 md:mb-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Message */}
          <div className="flex flex-col items-center text-center mb-4 md:mb-6">
            <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">{t("forgotPasswordDialogTitle", "Email Sent")}</h3>
            <p className="text-gray-300 text-sm md:text-base">{t("forgotPasswordDialogMessage")}</p>
          </div>

          {/* Button */}
          <div className="w-full flex justify-center">
            <button 
              onClick={handleClose} 
              className="w-full max-w-xs py-2 md:py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 text-sm md:text-base"
            >
              {t("ok", "OK")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPasswordDialog;