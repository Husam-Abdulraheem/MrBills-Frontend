import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function RegisterDialog(props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const navigator = useNavigate();

  useEffect(() => {
    setIsOpen(props.isOpen);
  }, [props.isOpen]);

  const dialogFunction = () => {
    setIsOpen(false);
    if (props.to) {
      navigator(props.to);
    }
  };

  return (
    <>
      {isOpen && (
        <>
          {/* Transparent background */}
          <div
            onClick={dialogFunction}
            className="absolute bg-black bg-opacity-60 left-0 right-0 w-full h-full content-center z-10"
          ></div>

          {/* Dialog */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] p-5 border-none rounded-lg shadow-md z-[1000] text-center bg-neutral-900">
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-center align-bottom transition-all transform rounded-lg shadow-xl rtl:text-right bg-neutral-900 sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <h1 className="text-2xl text-white">
                {t("registerDialog.great", "Great!")}
              </h1>
              <p className="text-white my-3">
                {t(
                  "registerDialog.message",
                  "Now check your email to verify the link that has been sent"
                )}
              </p>
              <button
                onClick={dialogFunction}
                className="rounded-full px-14 py-2 place-self-center bg-[var(--yellow)] font-bold text-sm"
              >
                {t("registerDialog.okay", "Okay")}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
