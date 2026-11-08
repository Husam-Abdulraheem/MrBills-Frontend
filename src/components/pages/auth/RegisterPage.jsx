import * as yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Link } from "react-router-dom";
import { registerAPI } from "../../../helpers/APIs/UserAPIs";
import { useState } from "react";
import ErrorAlert from "../../alerts/ErrorAlert";
import Loading from "../../alerts/Loading";
import RegisterDialog from "../../dialogs/RegisterDialog";
import { useTranslation } from "react-i18next";

function RegisterPage() {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const validationSchema = yup.object({
    fullName: yup
      .string()
      .min(3, t("register.fullNameMin"))
      .required(t("register.fullNameRequired")),
    email: yup
      .string()
      .trim()
      .email(t("register.emailInvalid"))
      .required(t("register.emailRequired")),
    password: yup
      .string()
      .min(6, t("register.passwordMin"))
      .matches(/^(?=.*[a-z])/, t("register.passwordLowercase"))
      .matches(/^(?=.*[A-Z])/, t("register.passwordUppercase"))
      .matches(/^(?=.*[0-9])/, t("register.passwordNumber"))
      .required(t("register.passwordRequired")),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], t("register.passwordsMustMatch"))
      .required(t("register.confirmPasswordRequired")),
    policyAgreement: yup
      .boolean()
      .oneOf([true], t("register.policyAgreementLabel"))
      .required(t("register.policyAgreementRequired")),
  });

  const registerRequest = async (values) => {
    setIsSubmitting(true);
    try {
      setIsLoading(true);
      clearTimeout(timer);
      setErrorMessage("");

      const response = await registerAPI(
        values.fullName,
        values.email,
        values.password,
        values.confirmPassword,
        ""
      );

      if (response?.success) {
        setIsOpen(true);
      } else {
        setErrorMessage(response);
        let tId = setTimeout(() => {
          setErrorMessage("");
        }, 5000);
        setTimer(tId);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
    setIsSubmitting(false);
    return false;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center p-4">
      <RegisterDialog to={"/login"} isOpen={isOpen} />

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
        <div className="bg-[var(--dark)] text-[var(--yellow)] p-4 md:p-6 text-center flex flex-col items-center justify-center">
          <h1 className="font-bold text-xl md:text-2xl lg:text-3xl">
            {t("register.createAccountTitle")}
          </h1>
          <p className="mt-2 text-xs md:text-sm">{t("register.welcomeMessage")}</p>
        </div>

        {/* Form Section */}
        <div className="p-4 md:p-6 lg:p-8" dir="rtl">
          <Formik
            initialValues={{
              fullName: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              registerRequest(values);
            }}
          >
            {({ errors, touched }) => (
              <Form className="flex flex-col space-y-4 md:space-y-6">
                {/* Full Name Field */}
                <div className="flex flex-col">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-yellow-500 mb-1"
                  >
                    {t("register.fullNamePlaceholder")}
                  </label>
                  <Field
                    placeholder={t("register.fullNamePlaceholder")}
                    name="fullName"
                    className={`w-full px-3 py-2 md:px-4 md:py-3 bg-gray-900 rounded-lg border ${errors.fullName && touched.fullName
                        ? "border-red-500"
                        : "border-gray-700"
                      } focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all text-white text-sm md:text-base`}
                    id="fullName"
                  />
                  <ErrorMessage
                    name="fullName"
                    component="div"
                    className="text-red-400 text-xs mt-1 flex items-center"
                  />
                </div>

                {/* Email Field */}
                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-yellow-500 mb-1"
                  >
                    {t("register.emailPlaceholder")}
                  </label>
                  <Field
                    placeholder={t("register.emailPlaceholder")}
                    name="email"
                    className={`w-full px-3 py-2 md:px-4 md:py-3 bg-gray-900 rounded-lg border ${errors.email && touched.email
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
                    {t("register.passwordPlaceholder")}
                  </label>
                  <Field
                    type="password"
                    name="password"
                    placeholder={t("register.passwordPlaceholder")}
                    className={`w-full px-3 py-2 md:px-4 md:py-3 bg-gray-900 rounded-lg border ${errors.password && touched.password
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

                {/* Confirm Password Field */}
                <div className="flex flex-col">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-yellow-500 mb-1"
                  >
                    {t("register.confirmPasswordPlaceholder")}
                  </label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder={t("register.confirmPasswordPlaceholder")}
                    className={`w-full px-3 py-2 md:px-4 md:py-3 bg-gray-900 rounded-lg border ${errors.confirmPassword && touched.confirmPassword
                        ? "border-red-500"
                        : "border-gray-700"
                      } focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all text-white text-sm md:text-base`}
                    id="confirmPassword"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-400 text-xs mt-1 flex items-center"
                  />
                </div>
                
                {/* policy agreement link */}
                <div className="flex items-center gap-2">
                  <Field
                    type="checkbox"
                    
                    id="policyAgreement"
                    name="policyAgreement"
                    className={`w-4 h-4 rounded border focus:ring-2 focus:ring-yellow-500/40 
      ${errors.policyAgreement && touched.policyAgreement
                        ? "border-red-500"
                        : "border-gray-700"
                      }`}
                  />

                  <Link
                    to={"/terms"}
                    className={`text-yellow-500 hover:text-yellow-400 underline transition-colors text-xs md:text-sm border ${errors.policyAgreement && touched.policyAgreement
                        ? "border-red-500"
                        : "border-gray-700"
                      }`}
                  >
                    {t("register.policyAgreementLabel")}
                  </Link>
                </div>

                <ErrorMessage
                  name="policyAgreement"
                  component="div"
                  className="text-red-400 text-xs mt-1"
                />

                {/* Submit Button */}
                <div className="pt-2 md:pt-4 flex flex-col">
                  <button
                    className={`w-full rounded-lg py-2 md:py-3 bg-yellow-500 text-black font-bold hover:bg-yellow-400 active:bg-yellow-600 transition-colors shadow-lg flex items-center justify-center ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      } text-sm md:text-base`}
                    disabled={isSubmitting}
                    type="submit"
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
                        {t("register.creatingAccount")}
                      </span>
                    ) : (
                      t("register.submit")
                    )}
                  </button>

                  <p className="text-gray-400 mt-4 md:mt-6 text-center text-xs md:text-sm">
                    {t("register.haveAccount")}{" "}
                    <Link
                      className="font-bold text-yellow-500 hover:text-yellow-400 underline transition-colors"
                      to={"/login"}
                    >
                      {t("register.login")}
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

export default RegisterPage;