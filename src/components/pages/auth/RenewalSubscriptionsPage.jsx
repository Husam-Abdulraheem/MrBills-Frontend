import React, { useEffect, useState, useContext } from "react";
import { getSubscriptionAPI } from "../../../helpers/APIs/GroupAPIs";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GroupContext } from "../../../helpers/Contexts/GroupContext";
import { ProfileContext } from "../../../helpers/Contexts/ProfileContext";
import WebSubscriptionsRenewal from "../WebSubscriptionsRenewal";
import Loading from "../../alerts/Loading";

function RenewalSubscriptionsPage() {
  const { t } = useTranslation();
  const [subscription, setSubscription] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [priceRenewal, setPriceRenewal] = useState(0);
  const [showAutoRenewalMessage, setShowAutoRenewalMessage] = useState(false);
  const redirectedRef = React.useRef(false); // لمنع double redirect بدون إعادة render
  const nav = useNavigate();
  const { setGroup } = useContext(GroupContext);
  const { setProfile } = useContext(ProfileContext);

  useEffect(() => {
    const subscriptionRequest = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        if (!redirectedRef.current) {
          redirectedRef.current = true;
          nav("/login");
        }
        return;
      }

      setIsLoading(true);
      try {
        const response = await getSubscriptionAPI();

        if (response?.success) {
          if (response?.data?.daysLeft <= 1) {
            setSubscription(response.data);

            // عرض رسالة التجديد التلقائي حسب نوع الدفع
            if (
              (window.cordova && response.data.paymentMethod === 0) ||
              response.data.paymentMethod === 0
            ) {
              setShowAutoRenewalMessage(true);
            } else {
              setShowAutoRenewalMessage(false);
            }
          } else {
            if (!redirectedRef.current) {
              redirectedRef.current = true;
              nav("/main");
            }
          }
        } else if (response?.status === 401) {
          if (!redirectedRef.current) {
            redirectedRef.current = true;
            nav("/login");
          }
        } else {
          if (!redirectedRef.current) {
            redirectedRef.current = true;
            nav("/group_selection");
          }
        }
      } catch (error) {
        console.error(error);
        if (!redirectedRef.current) {
          redirectedRef.current = true;
          nav("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    subscriptionRequest();
  }, [nav]); // أزل redirected من التبعيات

  useEffect(() => {
    if (subscription?.PriceAmount) {
      setPriceRenewal(subscription.PriceAmount);
    }
  }, [subscription]);

  // أزرار
  const handleBackToMain = () => {
    setShowAutoRenewalMessage(false);
    if (!redirectedRef.current) {
      redirectedRef.current = true;
      nav("/main");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (!redirectedRef.current) {
      redirectedRef.current = true;

      nav("/login");
    }
  };

  // شاشة التجديد التلقائي
  if (showAutoRenewalMessage) {
    return (
      <main className="absolute top-0 w-full h-full bg-[#171715] flex items-center justify-center">
        <div className="bg-[var(--lightDark)] border-2 border-[var(--yellow)] rounded-2xl p-8 mx-6 text-center max-w-md">
          <div className="mb-6">
            <svg
              className="w-16 h-16 mx-auto text-[var(--yellow)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              ></path>
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-[var(--yellow)] mb-4">
            {t("autoRenewalTitle", "التجديد التلقائي")}
          </h2>

          <p className="text-[var(--gray)] mb-6 leading-relaxed">
            {window.cordova
              ? t(
                  "autoRenewalMobileMessage",
                  "سيتم تجديد اشتراكك تلقائيًا عبر Google Play. لا حاجة لإجراء أي عمل - ستستمر في الاستمتاع بخدماتنا دون انقطاع."
                )
              : t(
                  "autoRenewalWebGoogleMessage",
                  "اشتراكك تم عبر Google Play وسيتم تجديده تلقائيًا. لا حاجة لإجراء أي عمل - ستستمر في الاستمتاع بخدماتنا دون انقطاع."
                )}
          </p>

          <div className="flex flex-col gap-3">
            <a
              href="mailto:mr.bills.original@gmail.com"
              className="px-8 py-3 bg-yellow-600 text-[var(--gray)] font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200 inline-block text-center"
            >
              {t("support", "الدعم")}
            </a>

            <button
              onClick={handleLogout}
              className=" top-4 right-4 text-[var(--yellow)]"
            >
              {t("logout", "تسجيل الخروج")}
            </button>
          </div>

          <p className="text-xs text-[var(--gray)] opacity-70 mt-4">
            {window.cordova
              ? t(
                  "manageSubscriptionHintMobile",
                  "يمكنك إدارة اشتراكك من متجر Google Play"
                )
              : t(
                  "manageSubscriptionHintWeb",
                  "يمكنك إدارة اشتراكك من إعدادات Google Play"
                )}
          </p>
        </div>
      </main>
    );
  }

  // لو على الموبايل ومافيش رسالة تجديد تلقائي → نعرض رسالة بديلة
  if (window.cordova && !showAutoRenewalMessage) {
    return (
      <main className="absolute top-0 w-full h-full bg-[#171715] flex items-center justify-center text-center px-6">
        <div className="bg-[var(--lightDark)] border-2 border-[var(--yellow)] rounded-2xl p-8 max-w-md">
          <h2 className="text-xl font-bold text-[var(--yellow)] mb-4">
            {t("manageSubscriptionOutsidePlay", "اشتراكك ليس عبر Google Play")}
          </h2>
          <p className="text-[var(--gray)] mb-6 leading-relaxed">
            {t(
              "manageSubscriptionOnWeb",
              "اشتراكك ليس عبر Google Play. يمكنك إدارته من موقعنا على الويب."
            )}
          </p>

          <div className="flex flex-col gap-3">
            <a
              href="https://app.mister-bills.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-yellow-600 text-black font-semibold rounded-lg hover:bg-yellow-700 transition-colors"
            >
              {t("manageOnWeb", "إدارة الاشتراك عبر الموقع")}
            </a>

            <button
              onClick={() =>

                cordova.InAppBrowser.open(
                  "mailto:mr.bills.original@gmail.com?subject=استفسار حول الاشتراك",
                  "_system"
                )
              }
              className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              {t("support", "التواصل مع الدعم")}
            </button>

            <button
              onClick={handleLogout}
              className="px-6 py-3 border border-[var(--yellow)] text-[var(--yellow)] font-semibold rounded-lg hover:bg-[var(--yellow)] hover:text-black transition-colors"
            >
              {t("logout", "تسجيل الخروج")}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      id="main"
      className="absolute top-0 w-full h-full bg-[#171715] text-[var(--gray)] overflow-auto"
    >
      {isLoading && <Loading />}
      <div className="mt-20 text-center">
        <h3 className="text-2xl font-bold my-2">{t("pricingPlan")}</h3>
        <p className="px-8">{t("renewalSubscriptionMessage")}</p>
      </div>

      <div className="container px-6 py-8 mx-auto h-[80%] mb-12 pb-12">
        <WebSubscriptionsRenewal
          pack={subscription?.package}
          priceAmount={priceRenewal}
          subscriptionData={subscription}
          otherFeatures={[
            t("allFeatures"),
            t("unlimitedBills"),
            t("technicalSupport"),
          ]}
        />
      </div>
    </main>
  );
}

export default RenewalSubscriptionsPage;
