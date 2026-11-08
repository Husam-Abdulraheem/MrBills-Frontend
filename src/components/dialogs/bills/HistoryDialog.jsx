import { useState } from "react";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";

function HistoryDialog(props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <svg
        onClick={() => setIsOpen(true)}
        className="size-7 me-1"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
        />
      </svg>

      {isOpen && createPortal(
        <>
          {/* Transparent background */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed bg-black bg-opacity-80 top-0 left-0 right-0 w-full h-full content-center z-50 overflow-auto"
          ></div>

          {/* Dialog */}
          <div className="pop_up fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] py-4 px-5 border border-[var(--yellow)] rounded-2xl shadow-md z-[1000] bg-neutral-900 transition-all duration-300 text-white">
            {/* History Mapping */}
            <ul dir="rtl" className="list-disc px-4 text-white">
              {props?.log?.length > 0 ? (
                props?.log?.map((log, index) => {
                  return log.paymentType === "Settled" ? (
                    <li key={index} className="font-bold border-b my-2">
                      {log.name} {t("settled")} <span className="text-red-600">{log.amount}₺ </span>
                    </li>
                  ) : (
                    <li key={index} className="font-bold border-b my-2">
                      {log.name} {t("paid")} <span className="text-green-600">{log.amount}₺</span>
                    </li>
                  );
                })
              ) : (
                <h3 className="text-center">{t("noRecentActivities")}</h3>
              )}
            </ul>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

export default HistoryDialog;
