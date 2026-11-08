import SureDialogSubscription from "../dialogs/subscriptions/SureDialogSubscription";
import { newSubscriptionAPI } from "../../helpers/APIs/SubscriptionAPIs";
import Loading from "../alerts/Loading";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function WebSubscriptions() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();


  const handleWebSubscription = async (pkg, type, period, paymentMethod) => {
  try {
    const response = await newSubscriptionAPI({
      package: pkg,
      type,
      period,
      paymentMethod,
      purchaseToken: null,
      subscriptionId: null,
    });
    
    if (response) {
      // Subscription successful
      setIsLoading(false);
      nav("/main");
    } else {
      // Handle error
      setIsLoading(false);
    }
  } catch (error) {
    console.error("Web subscription error:", error);
  }
};

  return (
  <div className="flex flex-col items-center justify-center min-h-screen py-12 px-2 ">
  {isLoading && <Loading />}
  
    {/* back button */}
    <button
      onClick={() => nav(-1)}
      className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors duration-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  <div className="text-center mb-12">
    <h1 className="text-4xl font-bold text-white mb-4">
      {t("webSubscriptions.title", "اختر باقة الاشتراك المناسبة")}
    </h1>
    <p className="text-gray-300 max-w-2xl mx-auto">
      {t("webSubscriptions.subtitle", "ابدأ مجاناً أو اختر الباقة المناسبة لاحتياجاتك")}
    </p>
  </div>

  <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-6 w-full max-w-6xl">
    {/* Free Pack */}
    <div className="relative flex flex-col w-full max-w-md p-8 text-center border-2 border-green-500 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="flex-shrink-0 mb-6">
        <h2 className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold tracking-tight text-white uppercase rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
          {t("webSubscriptions.freePackTitle", "الباقة المجانية")}
        </h2>
      </div>
      
      <div className="flex-shrink-0 mb-6 p-4 rounded-lg">
        <div className="flex items-baseline justify-center">
          <span className="text-2xl font-bold text-green-400">₺</span>
          <span className="text-4xl font-bold text-green-400 ml-1">0.00</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {t("foreverFree", "مجاناً إلى الأبد")}
        </div>
      </div>
      
      <div className="mb-6 py-4 border-t border-b border-gray-700">
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {t("upTo3People", "حتى 3 أشخاص")}
          </li>
          <li className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {t("basicFeatures", "ميزات أساسية")}
          </li>
          <li className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {t("upTo5BillsWeakly", "حتى 5 فواتير أسبوعيا")}
          </li>
          <li className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {t("continuousUpdates", "تحديثات مستمرة")}
          </li>
        </ul>
      </div>
      
      <div className="mt-auto">
        <button 
          onClick={() => handleWebSubscription(0, 0, null, null)} 
          className="w-full px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
        >
          {t("subscribeFree", "اشترك مجاناً")}
        </button>
      </div>
    </div>

    {/* Small Pack */}
    <div className="relative flex flex-col w-full max-w-md p-8 text-center border border-gray-700 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="flex-shrink-0 mb-6">
        <h2 className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold tracking-tight text-white uppercase rounded-full bg-gradient-to-r from-yellow-500 to-orange-600">
          {t("smallPack", "الباقة الصغيرة")}
        </h2>
      </div>
      
      <div className="flex-shrink-0 mb-6 p-4 rounded-lg">
        {/* Original Price */}
        <s className="block mb-2">
          <div className="flex items-baseline justify-center">
            <span className="text-sm font-medium text-gray-400">₺</span>
            <span className="text-md font-medium text-gray-400 ml-1">30.00</span>
          </div>
        </s>
        {/* Trial Price */}
        <div className="flex items-baseline justify-center">
          <span className="text-2xl font-bold text-green-400">₺</span>
          <span className="text-4xl font-bold text-green-400 ml-1">0.00</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {t("thirtyDayTrial", "تجربة 30 يوم")}
        </div>
      </div>
      
      <div className="mb-6 py-4 border-t border-b border-gray-700">
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {t("upTo3People", "حتى 3 أشخاص")}
          </li>
          <li className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {t("technicalSupport", "دعم فني")}
          </li>
          <li className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {t("unlimitedBills", "فواتير غير محدودة")}
          </li>
          <li className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {t("continuousUpdates", "تحديثات مستمرة")}
          </li>
          <li className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {t("noAds", "لا إعلانات")}
          </li>
        </ul>
      </div>
      
      <div className="mt-auto">
        <SureDialogSubscription func={(pkg) => handleWebSubscription(pkg, 1, 0, 1)} pack={0} />
      </div>
    </div>

    {/* Medium Pack - Recommended */}
    <div className="relative flex flex-col w-full max-w-md p-8 text-center border-2 border-yellow-400 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 z-10">
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <span className="px-4 py-1 text-xs font-bold text-white uppercase bg-yellow-500 rounded-full">
          {t("recommended", "موصى به")}
        </span>
      </div>
      
      <div className="flex-shrink-0 mb-6">
        <h2 className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold tracking-tight text-white uppercase rounded-full bg-gradient-to-r from-yellow-500 to-orange-600">
          {t("mediumPack", "الباقة المتوسطة")}
        </h2>
      </div>
      
      <div className="flex-shrink-0 mb-6 p-4 rounded-lg">
        {/* Original Price */}
        <s className="block mb-2">
          <div className="flex items-baseline justify-center">
            <span className="text-sm font-medium text-gray-400">₺</span>
            <span className="text-md font-medium text-gray-400 ml-1">50.00</span>
          </div>
        </s>
        {/* Trial Price */}
        <div className="flex items-baseline justify-center">
          <span className="text-2xl font-bold text-green-400">₺</span>
          <span className="text-4xl font-bold text-green-400 ml-1">0.00</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {t("thirtyDayTrial", "تجربة 30 يوم")}
        </div>
      </div>
      
      <div className="mb-6 py-4 border-t border-b border-gray-700">
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {t("upTo5People", "حتى 5 أشخاص")}
          </li>
          <li className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {t("technicalSupport", "دعم فني")}
          </li>
          <li className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {t("unlimitedBills", "فواتير غير محدودة")}
          </li>
          <li className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {t("continuousUpdates", "تحديثات مستمرة")}
          </li>
          <li className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {t("noAds", "لا إعلانات")}
          </li>
        </ul>
      </div>
      
      <div className="mt-auto">
        <SureDialogSubscription func={(pkg) => handleWebSubscription(pkg, 1, 0, 1)} pack={1} />
      </div>
    </div>

    {/* Large Pack */}
    <div className="relative flex flex-col w-full max-w-md p-8 text-center border border-gray-700 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="flex-shrink-0 mb-6">
        <h2 className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold tracking-tight text-white uppercase rounded-full bg-gradient-to-r from-yellow-500 to-orange-600">
          {t("largePack", "الباقة الكبيرة")}
        </h2>
      </div>
      
      <div className="flex-shrink-0 mb-6 p-4 rounded-lg">
        {/* Original Price */}
        <s className="block mb-2">
          <div className="flex items-baseline justify-center">
            <span className="text-sm font-medium text-gray-400">₺</span>
            <span className="text-md font-medium text-gray-400 ml-1">70.00</span>
          </div>
        </s>
        {/* Trial Price */}
        <div className="flex items-baseline justify-center">
          <span className="text-2xl font-bold text-green-400">₺</span>
          <span className="text-4xl font-bold text-green-400 ml-1">0.00</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {t("thirtyDayTrial", "تجربة 30 يوم")}
        </div>
      </div>
      
      <div className="mb-6 py-4 border-t border-b border-gray-700">
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {t("upTo7People", "حتى 7 أشخاص")}
          </li>
          <li className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {t("technicalSupport", "دعم فني")}
          </li>
          <li className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {t("unlimitedBills", "فواتير غير محدودة")}
          </li>
          <li className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {t("continuousUpdates", "تحديثات مستمرة")}
          </li>
          <li className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {t("noAds", "لا إعلانات")}
          </li>
        </ul>
      </div>
      
      <div className="mt-auto">
        <SureDialogSubscription func={(pkg) => handleWebSubscription(pkg, 1, 0, 1)} pack={2} />
      </div>
    </div>
  </div>

  <div className="mt-12 text-center text-gray-400 text-sm">
    <p>{t("webSubscriptions.note", "جميع الأسعار تشمل الضريبة. الفترة التجريبية لمدة 30 يوم.")}</p>
  </div>
</div>
  );
}

export default WebSubscriptions;
