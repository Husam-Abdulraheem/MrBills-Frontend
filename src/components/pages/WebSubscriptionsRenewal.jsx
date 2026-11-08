import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { renewalSubscriptionWebAPI } from "../../helpers/APIs/SubscriptionAPIs";
import ErrorAlert from "../alerts/ErrorAlert";

function WebSubscriptionsRenewal(props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [timer, setTimer] = useState(null);
  const navigate = useNavigate();

  const handleRenew = async () => {
    setLoading(true);
    const result = await renewalSubscriptionWebAPI();
    setLoading(false);

    if (!result) {
      setErrorMessage(t("renewalFailed", "فشل تجديد الاشتراك"));

      const newTimer = setInterval(() => setErrorMessage(""), 5000);
      setTimer(newTimer);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const renderCard = (title, price, desc, border, recommended = false) => (
    <>
      <div
        className={`relative flex flex-col w-full max-w-sm p-8 space-y-8 text-center bg-gradient-to-b from-[#232321] to-[#1c1c1a] border rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          recommended
            ? "border-2 border-amber-400 ring-2 ring-amber-400/20 ring-offset-2 ring-offset-[#171715] -translate-y-2"
            : "border-[#3a3a35]"
        } ${border}`}
      >
        {/* شارة التوصية */}
        {recommended && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="px-4 py-1 text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-[#171715] rounded-full shadow-md">
              {t("recommended", "الأكثر طلباً")}
            </span>
          </div>
        )}

        <div className="flex-shrink-0 pt-2">
          <h2 className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold tracking-wide text-[#e2e2dc] uppercase rounded-full bg-[#2a2a28] border border-[#3a3a35]">
            {title}
          </h2>
        </div>

        <div className="flex-shrink-0">
          <div className="flex items-baseline justify-center">
            <span className="text-lg font-medium text-amber-400">₺</span>
            <span className="text-4xl font-bold text-[#f0f0ec] ml-1">
              {price}
            </span>
            <span className="text-sm text-[#9c9c95] ml-2">
              /{t("perMonth", "شهرياً")}
            </span>
          </div>
        </div>

        <ul className="flex-1 space-y-3 text-[#d0d0ca]">
          {desc.split("|").map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="w-5 h-5 mt-0.5 mr-2 text-amber-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span className="text-left">{feature.trim()}</span>
            </li>
          ))}
          {/* ميزات إضافية من props */}
          {Array.isArray(props.otherFeatures) &&
            props.otherFeatures.length > 0 &&
            props.otherFeatures.map((feature, idx) => (
              <li key={`other-${idx}`} className="flex items-start">
                <svg
                  className="w-5 h-5 mt-0.5 mr-2 text-green-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span className="text-left">{feature}</span>
              </li>
            ))}
        </ul>

        <button
          onClick={handleRenew}
          disabled={loading}
          className={`w-full px-6 py-3 font-semibold rounded-lg transition-all duration-200 ${
            loading
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-amber-400 to-orange-500 text-[#171715] hover:from-amber-500 hover:to-orange-600 hover:shadow-lg hover:shadow-amber-900/30"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {t("loading", "جاري التحميل...")}
            </span>
          ) : (
            t("confirmRenewal", "تأكيد التجديد")
          )}
        </button>
      </div>
      <span dir="rtl">
        {t("allPaymentsViaShopier", "جميع المدفوعات عبر Shopier")}
      </span>
    </>
  );

  return (
    <div className="flex flex-col items-center justify-center space-y-8 lg:-mx-4 lg:flex-row lg:items-stretch lg:space-y-0">
      <button
        onClick={handleLogout}
        className="absolute top-5 left-5 text-gray-400 hover:text-white transition-colors duration-200"
      >
        {t("logout", "تسجيل الخروج")}
      </button>

      {props?.pack === 0 &&
        renderCard(
          t("smallPack"),
          "30.00",
          t("upTo3People"),
          "border-[var(--gray)]"
        )}
      {props?.pack === 1 &&
        renderCard(
          t("mediumPack"),
          "50.00",
          t("upTo5People"),
          "border-[var(--yellow)]",
          true
        )}
      {props?.pack === 2 &&
        renderCard(
          t("largePack"),
          "70.00",
          t("upTo7People"),
          "border-[var(--gray)]"
        )}

      {/* ✅ عرض التنبيه عند وجود رسالة */}
      {errorMessage && (
        <ErrorAlert
          message={errorMessage}
          setErrorMessage={setErrorMessage}
          timer={timer}
        />
      )}
    </div>
  );
}

export default WebSubscriptionsRenewal;
