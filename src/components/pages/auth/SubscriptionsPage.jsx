/* SubscriptionsPage.jsx */
import React, { useEffect, useState } from "react";
import { newSubscriptionAPI } from "../../../helpers/APIs/SubscriptionAPIs";
import MobileSubscriptions from "../../others/MobileSubscriptions";
import WebSubscriptions from "../../others/WebSubscriptions";
import { useNavigate } from "react-router-dom";
import Loading from "../../alerts/Loading";
import getGroupAPI from "../../../helpers/APIs/GroupAPIs";
import { useTranslation } from "react-i18next";

function SubscriptionsPage() {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [plans, setPlans] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  const handleProducts = async (store, platform) => {
    try {
      setIsMobile(true);
      const small_plan = store.get("small_plan", platform.GOOGLE_PLAY);
      const medium_plan = store.get("medium_plan", platform.GOOGLE_PLAY);
      const large_plan = store.get("large_plan", platform.GOOGLE_PLAY);
      setPlans({ small_plan, medium_plan, large_plan });
    } catch (error) {
      console.error(error);
    }
  };

  const initPurchase = () => {
    if (!window.CdvPurchase) {
      console.error("CdvPurchase is not available");
      setIsMobile(false);
      return;
    }

    try {
      const store = window.CdvPurchase.store;
      const ProductType = window.CdvPurchase.ProductType;
      const Platform = window.CdvPurchase.Platform;

      // Register products
      store.register([
        { type: ProductType.PAID_SUBSCRIPTION, id: "small_plan", platform: Platform.GOOGLE_PLAY },
        { type: ProductType.PAID_SUBSCRIPTION, id: "medium_plan", platform: Platform.GOOGLE_PLAY },
        { type: ProductType.PAID_SUBSCRIPTION, id: "large_plan", platform: Platform.GOOGLE_PLAY },
      ]);

      // Listen for product updates and approvals
      store
        .when()
        .productUpdated(() => handleProducts(store, Platform))
        .approved(approvePurchase);

      // Initialize store
      store.initialize([
        {
          platform: Platform.GOOGLE_PLAY,
          options: { needAppReceipt: false },
        },
      ]);

      // 🚀 استدعاء مباشر لعرض الباقات بعد التهيئة
      handleProducts(store, Platform);

      setIsMobile(true);
    } catch (error) {
      console.error(error);
      setIsMobile(false);
    }
  };

  // free package (الباقة المجانية)
  window.onFreePackageSubscribe = async () => {
    setIsLoading(true);
    try {
      const response = await newSubscriptionAPI({
        package: 0,
        type: 0,
        period: 0,
        paymentMethod: null,
        purchaseToken: null,
        subscriptionId: null,
      });
      setIsLoading(false);
      if (response) nav("/main");
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const approvePurchase = async (order) => {
    try {
      if (!order || !order.nativePurchase) {
        console.error("Invalid order object:", order);
        setIsLoading(false);
        return;
      }

      order.finish();
      setIsLoading(true);

      if (order.state === "approved" || order.state === "finished") {
        const packageMap = {
          small_plan: 0,
          medium_plan: 1,
          large_plan: 2,
        };

        const productId = order.nativePurchase?.productId;
        if (!productId) {
          console.error("Could not find product ID in order:", order);
          setIsLoading(false);
          return;
        }

        const pkg = packageMap[productId];
        if (pkg === undefined) {
          console.error("Unknown product ID:", productId);
          setIsLoading(false);
          return;
        }

        const response = await newSubscriptionAPI({
          package: pkg,
          type: 1,
          period: 0,
          paymentMethod: 0,
          purchaseToken: order.transaction?.purchaseToken || order.purchaseId,
          subscriptionId: order.nativePurchase?.productId,
        });

        if (response) {
          setIsLoading(false);
          nav("/main");
        } else {
          throw new Error("Server error during subscription");
        }
      } else {
        throw new Error("Purchase not approved");
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  // initPurchase once
  useEffect(() => {
    if (window.cordova) {
      document.addEventListener("deviceready", initPurchase);
      return () => document.removeEventListener("deviceready", initPurchase);
    } else {
      setIsMobile(false);
    }
  }, []);

  // 🚀 تحديث الباقات كلما تغير nav
  useEffect(() => {
    if (isMobile && window.CdvPurchase) {
      const store = window.CdvPurchase.store;
      const Platform = window.CdvPurchase.Platform;
      handleProducts(store, Platform);
    }
  }, [nav]);

  // check group
  useEffect(() => {
    const fetchGroup = async () => {
      setIsLoading(true);
      try {
        const response = await getGroupAPI();
        if (response?.success) nav("/main");
        else if (response?.status === 401) nav("/login");
      } catch (error) {
        console.error(error);
        nav("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchGroup();
  }, [nav]);

  return (
    <main className="absolute top-0 w-full h-full bg-[var(--dark)] text-[var(--gray)] overflow-auto">
      {isLoading && <Loading />}

      <div className="container px-0 py-8 mx-auto h-[90%] mb-12 pb-12">
        {isMobile ? (
          <MobileSubscriptions plans={plans} pack={3} />
        ) : (
          <WebSubscriptions />
        )}
      </div>
    </main>
  );
}

export default SubscriptionsPage;
