import { Formik, Form, Field, ErrorMessage } from "formik";
import { useParams } from "react-router-dom";
import { useState } from "react";
import * as yup from "yup";
import axios from "axios";
import SuccessResetDialog from "../../dialogs/SuccessResetDialog";
import FailedResetDialog from "../../dialogs/FailedResetDialog";
import { useTranslation } from "react-i18next";
import { restPasswordAPI } from "../../../helpers/APIs/UserAPIs";

function ResetPassword() {
  const { t } = useTranslation();
  const { id, code } = useParams();
  const [successReset, setSuccessReset] = useState(false);
  const [failedReset, setFailedReset] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting form:", values);
      console.log("User ID:", id);
      console.log("Reset Code:", code);

      if (!id || !code) {
        console.error("Error: ID or code is missing.");
        alert(t("resetPassword.invalidLink"));
        return;
      }

      const response = await restPasswordAPI(id, code, values.password);

      if (response?.success) {
        setSuccessReset(true);
      } else {
        console.error("API Error:", response.data);
        setFailedReset(true);
      }
    } catch (error) {
      console.error("Error resetting password:", error);

      if (error.response) {
        console.error("Server responded with error:", error.response.data);
        alert(error.response.data?.message || t("resetPassword.serverError"));
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert(t("resetPassword.networkError"));
      } else {
        console.error("Request setup error:", error.message);
        alert(t("resetPassword.unknownError"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation schema with translated error messages
  const validationSchema = yup.object({
    password: yup
      .string()
      .min(6, t("resetPassword.passwordMin"))
      .matches(/^(?=.*[a-z])/, t("resetPassword.passwordLowercase"))
      .matches(/^(?=.*[A-Z])/, t("resetPassword.passwordUppercase"))
      .matches(/^(?=.*[0-9])/, t("resetPassword.passwordNumber"))
      .required(t("resetPassword.passwordRequired")),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], t("resetPassword.passwordsMustMatch"))
      .required(t("resetPassword.confirmPasswordRequired")),
  });

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      {/* Content Container */}
      <div className="w-full max-w-md bg-[var(--dark)] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">

        {/* Header Section */}
        <div className="w-full px-4 sm:px-8 py-6 sm:py-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 bg-yellow-500/20 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-8 sm:w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">{t("resetPassword.title")}</h1>
          <p className="text-yellow-300/80 text-xs sm:text-sm">
            {t("resetPassword.description", "Create a new password for your account")}
          </p>
        </div>

        {/* Success Message */}
        {successReset && (
          <SuccessResetDialog onCancel={() => setSuccessReset(false)} />
        )}

        {/* Failed Message */}
        {failedReset && (
          <FailedResetDialog onCancel={() => setFailedReset(false)} />
        )}

        {/* Form Section */}
        <div className="w-full px-4 sm:px-8 py-6 sm:py-8" dir="rtl">
          <Formik
            initialValues={{
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => handleSubmit(values)}
          >
            {({ errors, touched }) => (
              <Form className="w-full flex flex-col">
                {/* Password Field */}
                <div className="mb-4 sm:mb-6 w-full">
                  <div className="relative flex items-center">
                    <Field
                      type="password"
                      name="password"
                      placeholder={t("resetPassword.newPasswordPlaceholder")}
                      className={`w-full text-white bg-gray-700/50 border ${errors.password && touched.password ? 'border-red-500' : 'border-gray-600'} rounded-lg px-3 py-2 sm:px-4 sm:py-3 ps-9 sm:ps-10 outline-none transition-all duration-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-400 text-sm sm:text-base`}
                      id="password"
                    />
                    <div className="absolute right-2 sm:right-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-400 text-xs mt-1 sm:mt-2 flex items-center"
                  >
                    {msg => (
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>

                {/* Confirm Password Field */}
                <div className="mb-4 sm:mb-6 w-full">
                  <div className="relative flex items-center">
                    <Field
                      type="password"
                      name="confirmPassword"
                      placeholder={t("resetPassword.confirmPasswordPlaceholder")}
                      className={`w-full text-white bg-gray-700/50 border ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-600'} rounded-lg px-3 py-2 sm:px-4 sm:py-3 ps-9 sm:ps-10 outline-none transition-all duration-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-400 text-sm sm:text-base`}
                      id="confirmPassword"
                    />
                    <div className="absolute right-2 sm:right-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-400 text-xs mt-1 sm:mt-2 flex items-center"
                  >
                    {msg => (
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>

                {/* Submit Button */}
                <div className="w-full text-center mt-6 sm:mt-8 flex flex-col items-center">
                  <button
                    className={`w-full py-2 sm:py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''} text-sm sm:text-base flex items-center justify-center`}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t("resetPassword.processing")}
                      </div>
                    ) : (
                      t("resetPassword.submit")
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-400/10 rounded-full blur-xl hidden sm:block"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-400/5 rounded-full blur-xl hidden sm:block"></div>
    </main>
  );
}

export default ResetPassword;