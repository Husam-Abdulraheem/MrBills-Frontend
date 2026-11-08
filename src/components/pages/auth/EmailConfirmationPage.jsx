import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../../alerts/Loading";
import { useTranslation } from "react-i18next";
import { confirmEmailAPI } from "../../../helpers/APIs/UserAPIs";

function EmailConfirmationPage() {
  const { t } = useTranslation();
  const { id, code } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    async function confirmEmail() {
      try {
        const response = await confirmEmailAPI(id.toString(), code.toString());

        if (response?.success) {
          setLoading(false);
          // إعادة التوجيه إلى التطبيق إذا كان موجوداً
          setTimeout(() => {
            setAnimation(true);
            window.location.href = "mrbills://login";
          }, 100);
        } else {
          setLoading(false);
          setError(true);
          setTimeout(() => setAnimation(true), 100);
          throw new Error("Error In Confirming Email");
        }
      } catch (error) {
        setLoading(false);
        setError(true);
        setTimeout(() => setAnimation(true), 100);
        console.log(error);
      }
    }
    confirmEmail();
  }, [id, code]);

  return (
    <main className="min-h-screen w-full bg-[var(--dark)] flex items-center justify-center p-4">
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <Loading />
          <p className="text-gray-300 mt-4 text-lg">
            {t("emailConfirmation.verifying")}
          </p>
        </div>
      ) : error ? (
        <div
          className={`flex flex-col items-center justify-center max-w-md w-full ${
            animation ? "animate-fade-in" : "opacity-0"
          }`}
        >
          {/* Error Icon */}
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            {/* Animated ring */}
            <div className="absolute inset-0 border-4 border-red-500/30 rounded-full animate-ping"></div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
            {t("emailConfirmation.errorTitle")}
          </h1>
          <p className="text-gray-400 mb-8 text-center">
            {t(
              "emailConfirmation.errorDescription",
              "There was a problem confirming your email address. Please try again."
            )}
          </p>

          <Link
            to={"/login"}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            {t("emailConfirmation.errorLinkText", "Return to Login")}
          </Link>
        </div>
      ) : (
        <div
          className={`flex flex-col items-center justify-center max-w-md w-full ${
            animation ? "animate-fade-in" : "opacity-0"
          }`}
        >
          {/* Success Icon */}
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-green-500"
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
            </div>
            {/* Animated ring */}
            <div className="absolute inset-0 border-4 border-green-500/30 rounded-full animate-ping"></div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
            {t("emailConfirmation.successTitle")}
          </h1>
          <p className="text-gray-400 mb-8 text-center">
            {t(
              "emailConfirmation.successDescription",
              "Your email has been successfully confirmed. You can now log in to your account."
            )}
          </p>

          <Link
            to={"/login"}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            {t("emailConfirmation.successLinkText", "Continue to Login")}
          </Link>

          {/* Decorative elements */}
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-400/10 rounded-full blur-xl"></div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-400/10 rounded-full blur-xl"></div>
        </div>
      )}
    </main>
  );
}

export default EmailConfirmationPage;
