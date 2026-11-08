import { useState } from "react";
import { useTranslation } from "react-i18next";
import { demoStore } from "../../helpers/demoMockStore";

export default function DemoBanner() {
  const { t, i18n } = useTranslation();
  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem("mrbills_demo_banner_dismissed") === "true";
  });

  if (dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem("mrbills_demo_banner_dismissed", "true");
    setDismissed(true);
  };

  const handleReset = () => {
    demoStore.reset();
    window.location.reload();
  };

  // Determine back link URL based on current language
  const arabixLink =
    i18n.language === "ar"
      ? "https://www.arabixdev.com/ar"
      : i18n.language === "tr"
      ? "https://www.arabixdev.com/tr"
      : "https://www.arabixdev.com/en";

  return (
    <aside
      aria-label="Demo Banner"
      className="relative z-50 bg-[#161a23] text-gray-200 border-b border-[#2d3748] px-3 py-1.5 text-xs shadow-md"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Info & Tag */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 text-[11px]">
            <svg
              className="w-3 h-3 text-amber-400 animate-pulse"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.2-6.3-4.6-6.3 4.6 2.3-7.2-6-4.6h7.6z" />
            </svg>
            <span>{t("demo.bannerTag", "نسخة العرض التجريبية")}</span>
          </span>
          <span className="text-gray-300 hidden sm:inline text-[11px]">
            {t(
              "demo.bannerDesc",
              "تعمل بالكامل في المتصفح عبر بيانات تفاعلية (Mock Store)"
            )}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#242b38] hover:bg-[#2d3748] text-gray-200 hover:text-white transition-all border border-gray-700 text-[11px]"
            title={t("demo.resetTooltip", "استعادة البيانات التجريبية الافتراضية")}
          >
            <svg
              className="w-3 h-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>{t("demo.resetData", "استعادة البيانات")}</span>
          </button>

          <a
            href={arabixLink}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 hover:text-amber-200 transition-all border border-amber-500/30 text-[11px]"
            title={t("demo.backToArabixTooltip", "العودة إلى موقع ارابكس ديف")}
          >
            <span>Arabix Dev</span>
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>

          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
            title={t("demo.dismissTooltip", "إخفاء الشريط")}
            aria-label="Dismiss banner"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
