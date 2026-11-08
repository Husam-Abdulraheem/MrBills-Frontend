import "./App.css";
import "./Animations.css";
import "./index.css";
import Introduction from "./components/pages/Introduction";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./components/pages/auth/LoginPage";
import RegisterPage from "./components/pages/auth/RegisterPage";
import ForgotPasswordPage from "./components/pages/auth/ForgotPasswordPage";
import ResetPassowrd from "./components/pages/auth/ResetPassword";
import EmailConfirmationPage from "./components/pages/auth/EmailConfirmationPage";
import GroupSelectionPage from "./components/pages/GroupSelectionPage";
import MainPage from "./components/pages/main/MainPage";
import BillsPage from "./components/pages/main/BillsPage";
import GroupPage from "./components/pages/main/GroupPage";
import ProfilePage from "./components/pages/main/ProfilePage";
import SubscriptionsPage from "./components/pages/auth/SubscriptionsPage";
import ShareBillPage from "./components/others/ShareBillPage";
import { useState, useEffect } from "react";
import { GroupContext } from "./helpers/Contexts/GroupContext";
import { ProfileContext } from "./helpers/Contexts/ProfileContext";
import RenewalSubscriptionsPage from "./components/pages/auth/RenewalSubscriptionsPage";
import Terms from "./components/others/terms";
import "./i18n";
import i18n from "./i18n";
import { useTranslation } from "react-i18next";
import Waiting from "./components/others/Waiting";
import SupportButton from "./components/others/SupportButton";
import ShutdownScreen from "./components/others/ShutdownScreen";
import { appConfig } from "./appConfig";
import DemoBanner from "./components/others/DemoBanner";

function App() {
  document.addEventListener(
    "deviceready",
    () => {
      navigator.splashscreen.hide();
    },
    false
  );
  const [group, setGroup] = useState();
  const [profile, setProfile] = useState();
  const { i18n: i18next } = useTranslation();
  const direction = i18next.language === "ar" ? "rtl" : "ltr";

  // Sync language with URL if accessed via localized path (e.g., /ar/demo/mr-bills or /tr/demo/mr-bills)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const match = window.location.pathname.match(/^\/(ar|en|tr)(\/|$)/i);
      if (match && match[1] && i18next.language !== match[1].toLowerCase()) {
        i18next.changeLanguage(match[1].toLowerCase());
        localStorage.setItem("language", match[1].toLowerCase());
      }
    }
  }, [i18next]);

  // Support both standalone hosting and subpath hosting (e.g. /demo/mr-bills or /ar/demo/mr-bills)
  const getBasePath = () => {
    if (typeof window === "undefined") return "";
    const pathname = window.location.pathname;
    const match = pathname.match(/^(\/(ar|en|tr))?\/demo\/mr-bills/i);
    return match ? match[0] : "";
  };

  // Check for app shutdown
  if (appConfig.IS_APP_SHUTDOWN) {
    return (
        <div dir={direction}>
            <ShutdownScreen />
        </div>
    );
  }
  return (
    <div dir={direction}>
      <BrowserRouter basename={getBasePath()}>
        <DemoBanner />
        <ProfileContext.Provider value={{ profile, setProfile }}>
          <GroupContext.Provider value={{ group, setGroup }}>
            <Routes>
              <Route path="/" element={<Introduction />} />
              <Route path="/group_selection" element={<GroupSelectionPage />} />
              {/* Main Pages */}
              <Route path="/main" element={<MainPage />} />
              <Route path="/bills" element={<BillsPage />} />
              <Route path="/group" element={<GroupPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* Auth Pages  */}
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot_password" element={<ForgotPasswordPage />} />
              <Route
                path="/reset_password/:id/:code/"
                element={<ResetPassowrd />}
              />
              <Route
                path="/email_confirmation/:id/:code"
                element={<EmailConfirmationPage />}
              />
              <Route path="/subscription" element={<SubscriptionsPage />} />
              <Route
                path="/renewal_subscription"
                element={<RenewalSubscriptionsPage />}
              />
              <Route path="waiting" element={<Waiting />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/shareBill" element={<ShareBillPage />} />
              {/* Not Found Page Error */}
              <Route
                path="*"
                element={
                  <h1 className="text-red-600 text-center content-center h-full text-3xl">
                    404 Not Found
                  </h1>
                }
              />
            </Routes>

            <SupportButton />
          </GroupContext.Provider>
        </ProfileContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
