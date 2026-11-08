import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { loginAPI } from "../../../helpers/APIs/UserAPIs";
import { Link, useNavigate } from "react-router-dom";
import ErrorAlert from "../../alerts/ErrorAlert";
import { useState } from "react";
import Loading from "../../alerts/Loading";
import { useTranslation } from "react-i18next";

function LoginPage() {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState();
  const nav = useNavigate();

  const validationSchema = yup.object({
    email: yup
      .string()
      .email(t("login.emailInvalid"))
      .required(t("login.emailRequired")),
    password: yup.string().required(t("login.passwordRequired")),
  });

  const loginRequest = async (values, { setSubmitting }) => {
    setIsLoading(true);
    clearTimeout(timer);
    setErrorMessage("");

    const response = await loginAPI(values.email, values.password);
    if (response?.success) {
      localStorage.setItem("token", response.token);
      if (response.group) {
        nav("/main");
      } else {
        nav("/group_selection");
      }
      setSubmitting(false);
    } else {
      setErrorMessage(response || "Something went wrong");
      let tId = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      setTimer(tId);
      setSubmitting(false);
    }
    setIsLoading(false);
    return response;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center p-4">
      {errorMessage !== "" && (
        <ErrorAlert
          message={errorMessage}
          setErrorMessage={setErrorMessage}
          timer={timer}
        />
      )}
      {isLoading && <Loading />}

      <div className="w-full max-w-md bg-[var(--dark)] rounded-xl shadow-2xl overflow-hidden border border-yellow-500/20 flex flex-col">
        {/* Header with gradient */}
        <div className="p-4 md:p-6 text-center flex flex-col items-center justify-center">
          <h1 className="font-bold text-xl md:text-2xl lg:text-3xl text-[var(--yellow)]">
            {t("login.title")}
          </h1>
          <p className="text-gray-400 mt-2 text-xs md:text-sm">
            {t("login.welcomeMessage")}
          </p>
        </div>

        {/* Form Section */}
        <div className="p-4 md:p-6 lg:p-8" dir="rtl">
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={loginRequest}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="flex flex-col space-y-4 md:space-y-6">
                {/* Email Field */}
                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-yellow-500 mb-1"
                  >
                    {t("login.emailPlaceholder")}
                  </label>
                  <Field
                    placeholder={t("login.emailPlaceholder")}
                    name="email"
                    className={`w-full px-3 py-2 md:px-4 md:py-3 bg-gray-900 rounded-lg border ${
                      errors.email && touched.email
                        ? "border-red-500"
                        : "border-gray-700"
                    } focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all text-white text-sm md:text-base`}
                    id="email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-400 text-xs mt-1 flex items-center"
                  />
                </div>

                {/* Password Field */}
                <div className="flex flex-col">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-yellow-500 mb-1"
                  >
                    {t("login.passwordPlaceholder")}
                  </label>
                  <Field
                    type="password"
                    name="password"
                    placeholder={t("login.passwordPlaceholder")}
                    className={`w-full px-3 py-2 md:px-4 md:py-3 bg-gray-900 rounded-lg border ${
                      errors.password && touched.password
                        ? "border-red-500"
                        : "border-gray-700"
                    } focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all text-white text-sm md:text-base`}
                    id="password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-400 text-xs mt-1 flex items-center"
                  />
                </div>

                {/* Forgot Password Link */}
                <div className="text-left">
                  <Link
                    className="text-xs md:text-sm text-yellow-500 hover:text-yellow-400 transition-colors underline"
                    to={"/forgot_password"}
                  >
                    {t("login.forgotPassword")}
                  </Link>
                </div>

                {/* Submit Button */}
                <div className="pt-2 md:pt-4 flex flex-col">
                  <button
                    className={`w-full rounded-lg py-2 md:py-3 bg-yellow-500 text-black font-bold hover:bg-yellow-400 active:bg-yellow-600 transition-colors shadow-lg flex items-center justify-center ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    } text-sm md:text-base`}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 md:h-5 md:w-5 text-black"
                          xmlns="http://www.w3.org/2000/svg"
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
                        {t("login.loggingIn")}
                      </span>
                    ) : (
                      t("login.submit")
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem("token", "mock-jwt-token-demo");
                      nav("/main");
                    }}
                    className="w-full mt-3 rounded-lg py-2.5 md:py-3 bg-gray-800 text-yellow-400 font-bold hover:bg-gray-700 active:scale-[0.98] transition-all shadow-md flex items-center justify-center text-sm md:text-base border border-yellow-500/40"
                  >
                    ⚡ الدخول الفوري للنسخة التجريبية (1-Click Demo)
                  </button>

                  <p className="text-gray-400 mt-4 md:mt-6 text-center text-xs md:text-sm">
                    {t("login.noAccount")}{" "}
                    <Link
                      className="font-bold text-yellow-500 hover:text-yellow-400 underline transition-colors"
                      to={"/register"}
                    >
                      {t("login.create")}
                    </Link>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
