/* MobileSubscriptions.jsx */
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

// Helper to extract price string and currency symbol from PricingPhase
function extractPriceInfo(pricingPhase) {
  if (!pricingPhase || !pricingPhase.price)
    return { original: "", currency: "" };
  const original = pricingPhase.price; // e.g. "$4.99"
  // Extract leading non-numeric characters (currency symbol)
  const currencyMatch = original.match(/^([^\d.,]+)/);
  const currency = currencyMatch ? currencyMatch[1] : ""; // e.g. "$"
  return { original, currency };
}

function MobileSubscriptions({ plans, pack, isRenewal, priceAmount }) {
  const { t } = useTranslation();

  useEffect(() => {
    // No local state; plans prop drives UI
  }, [plans]);

  // Modified: allow free package selection
  const purchaseSubscribe = (planKey) => {
    if (
      planKey === "free_plan" &&
      typeof window.onFreePackageSubscribe === "function"
    ) {
      window.onFreePackageSubscribe();
      return;
    }
    const product = plans[planKey];
    if (product) {
      // Get the offer and order it
      const offer = product.getOffer();
      if (offer) {
        offer.order();
      } else {
        console.error(`No offer available for ${planKey}`);
      }
    } else console.error(`Plan ${planKey} not found`);
  };

  const renderPlan = (planData, label) => {
    // Choose paid offer (index 1 if trial exists)
    if (!planData) return null; // Prevent error if plan is missing
    const offer = planData?.offers?.[1] || planData?.offers?.[0];
    const pricingPhase = offer?.pricingPhases?.[0];
    const { original, currency } = extractPriceInfo(pricingPhase);

    const packageMap = {
      Small: 0,
      Medium: 1,
      Large: 2,
    };

    const packageType = packageMap[label];

    const featuresMap = {
      Small: [
        t("upTo3People"),
        t("allFeatures"),
        t("unlimitedBills"),
        t("technicalSupport"),
        t("continuousUpdates"),
        t("noAds"),
      ],
      Medium: [
        t("upTo5People"),
        t("allFeatures"),
        t("unlimitedBills"),
        t("technicalSupport"),
        t("continuousUpdates"),
        t("noAds"),
      ],
      Large: [
        t("upTo7People"),
        t("allFeatures"),
        t("unlimitedBills"),
        t("technicalSupport"),
        t("continuousUpdates"),
        t("noAds"),
      ],
    };

    return (
      <div className="relative flex flex-col w-full max-w-sm p-8 space-y-8 text-center bg-[var(--dark)] border border-gray-700 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        <h2 className="inline-flex items-center justify-center px-4 py-2 text-md font-semibold tracking-tight text-white uppercase rounded-full bg-gradient-to-r from-yellow-500 to-orange-600">
          {t(label)} {t("pack")}
        </h2>

        {/* Old price with strikethrough - hide if isRenewal */}
        {!isRenewal && original && (
          <s className="block text-sm font-medium text-gray-400">
            {original}
            {t("perMonth")}
          </s>
        )}

        {/* Trial price: 0.00 + currency symbol */}
        <div className="relative">
          <span className="text-4xl font-bold text-white">
            {priceAmount ? priceAmount : "0.00"}
          </span>
          <span className="text-lg font-bold text-yellow-400 ml-1">
            {currency}
          </span>
          <span className="block text-sm text-gray-400 mt-1">
            {t("perMonth")}
          </span>
        </div>

        <ul className="space-y-3 text-gray-300">
          {featuresMap[label]?.map((feature, i) => (
            <li key={i} className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        <button
          onClick={() => purchaseSubscribe(`${label.toLowerCase()}_plan`)}
          className="px-6 py-3 font-bold text-gray-900 uppercase transition-all duration-300 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg shadow-md hover:from-yellow-500 hover:to-yellow-600 hover:shadow-lg active:shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
        >
          {isRenewal
            ? t("renewNow", "Renew Now!")
            : t("sureDialog.startFreeTrial", "Start Free Trial")}
        </button>
      </div>
    );
  };
  const featuresMap = {
    Free: [
      t("upTo3People"),
      t("basicFeatures"),
      t("upTo5BillsWeakly"),
      t("continuousUpdates"),
    ],
  };
  return (
    <div className="flex flex-col items-center justify-center space-y-8 lg:flex-row lg:space-y-0 lg:space-x-6">
      {/* back button */}
      <button
        onClick={() => window.history.back()}
        className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors duration-200"
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
      {/* Free package card */}
      <div className="relative flex flex-col w-full max-w-sm p-8 space-y-8 text-center bg-[var(--dark)] border-2 border-green-500 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        <h2 className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold tracking-tight text-white uppercase rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
          {t("Free")} {t("pack")}
        </h2>
        <div className="relative">
          <span className="text-4xl font-bold text-white">0.00</span>
          <span className="text-lg font-bold text-green-400 ml-1">$</span>
          <span className="block text-sm text-gray-400 mt-1">
            {t("foreverFree")}
          </span>
        </div>
        <ul className="space-y-3 text-gray-300">
          {featuresMap["Free"].map((feature, i) => (
            <li key={i} className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        <button
          onClick={() => purchaseSubscribe("free_plan")}
          className="px-6 py-3 font-bold text-gray-900 uppercase transition-all duration-300 bg-gradient-to-r from-green-400 to-green-500 rounded-lg shadow-md hover:from-green-500 hover:to-green-600 hover:shadow-lg active:shadow-inner focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          {t("subscribeFree", "Subscribe Free")}
        </button>
      </div>

      {(pack === 0 || pack === 3) && renderPlan(plans.small_plan, "Small")}
      {(pack === 1 || pack === 3) && renderPlan(plans.medium_plan, "Medium")}
      {(pack === 2 || pack === 3) && renderPlan(plans.large_plan, "Large")}
    </div>
  );
}

MobileSubscriptions.propTypes = {
  plans: PropTypes.object.isRequired,
  pack: PropTypes.number,
  isRenewal: PropTypes.bool,
};
MobileSubscriptions.defaultProps = { pack: 3, isRenewal: false };

export default MobileSubscriptions;
