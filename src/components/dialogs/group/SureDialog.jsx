import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function SureDialog(props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      props?.func();
    }, 300);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-1 text-red-400 hover:text-red-500 transition-colors duration-200"
        aria-label={t("delete")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="w-5 h-5"
          fill="currentColor"
        >
          <path d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-256c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 256c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l32 0 0-48-32 0z" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Transparent background with blur effect */}
          <div
            onClick={handleClose}
            className={`fixed inset-0 bg-black backdrop-blur-sm z-40 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-80'}`}
          ></div>

          {/* Dialog */}
          <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md p-6 rounded-xl shadow-2xl z-50 transition-all duration-300 ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} bg-[var(--dark)] border border-red-500/30`}>

            <div className="relative z-10">
              {/* Warning Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>

              {/* Message */}
              <h3 className="text-xl font-bold text-white mb-2 text-center">{t("areYouSure")}</h3>
              <p className="text-gray-300 mb-6 text-center">
                {t("thisActionCannotBeUndone", "This action cannot be undone.")}
              </p>

              {/* Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleClose}
                  className="px-6 me-3 py-2 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-md hover:shadow-lg"
                >
                  {t("yes")}
                </button>
              </div>
            </div>

          </div>
        </>
      )}
    </>
  );
}

export default SureDialog;