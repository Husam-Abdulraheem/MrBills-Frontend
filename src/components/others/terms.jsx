import { FiArrowUp } from "react-icons/fi";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Terms = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleScrollTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  // button back to register page
  const handleBackToRegister = () => {
    navigate("/register");
  };

  return (
    <div
      dir="rtl"
      ref={scrollRef}
      className="w-full h-screen bg-[#171715] text-[var(--gray)] overflow-auto relative scroll-smooth"
    >
      <button
        onClick={handleBackToRegister}
        className="absolute top-5 left-5 text-gray-400 hover:text-white transition-colors duration-200"
        aria-label={t("backToRegister")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={handleScrollTop}
        className="fixed bottom-6 right-10 bg-[var(--yellow)] text-black font-bold py-2 px-2 rounded-full shadow-lg flex items-center justify-center"
        aria-label="Scroll to top"
      >
        <FiArrowUp className="w-6 h-6" />
      </button>
      <div className="container px-6 py-8 mx-auto max-w-2xl mt-6">
        <div className="bg-[var(--lightDark)] rounded-xl shadow-lg border border-[var(--gray)] p-8">
          <h1 className="text-3xl font-bold text-center mb-4 text-[var(--yellow)]">
            {t("privacyPolicy", "Privacy Policy")}
          </h1>
          <p className="text-center text-sm mb-6 opacity-80">
            {t("effectiveDate", "Effective Date: 02/02/2025")}
          </p>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {t("introductionTerms")}
            </h2>
            <p>{t("introductionText")}</p>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{t("infoWeCollect")}</h2>
            <ul className="list-disc pl-5">
              <li>{t("personalInfo")}</li>
              <li>{t("noDeviceInfo")}</li>
            </ul>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{t("howWeUseInfo")}</h2>
            <ul className="list-disc pl-5">
              <li>{t("provideServices")}</li>
              <li>{t("communicateUpdates")}</li>
              <li>{t("improveFunctionality")}</li>
              <li>{t("legalCompliance")}</li>
            </ul>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {t("dataStorageSecurity")}
            </h2>
            <p>{t("dataStorageSecurityText")}</p>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{t("sharingInfo")}</h2>
            <ul className="list-disc pl-5">
              <li>{t("serviceProviders")}</li>
              <li>{t("legalComplianceSharing")}</li>
            </ul>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{t("rightsChoices")}</h2>
            <ul className="list-disc pl-5">
              <li>{t("accessCorrection")}</li>
              <li>{t("dataDeletion")}</li>
            </ul>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {t("subscriptionPricing")}
            </h2>
            <p>{t("subscriptionPricingText")}</p>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {t("ageRestriction")}
            </h2>
            <p>{t("ageRestrictionText")}</p>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {t("internationalStorage")}
            </h2>
            <p>{t("internationalStorageText")}</p>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{t("policyUpdates")}</h2>
            <p>{t("policyUpdatesText")}</p>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {t("liabilityDisclaimer")}
            </h2>
            <p>{t("liabilityDisclaimerText")}</p>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {t("cookiesTracking")}
            </h2>
            <p>{t("cookiesTrackingText")}</p>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{t("contactUs")}</h2>
            <p className="mb-2">{t("contactUsText")}</p>
            <div className="flex items-center justify-center mb-2">
              <span className="mr-2">📧</span>
              <span className="font-semibold">mr.bills.original@gmail.com</span>
            </div>
            <p className="text-center text-xs opacity-70">{t("consentText")}</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
