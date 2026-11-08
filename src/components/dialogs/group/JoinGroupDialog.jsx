import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { JoinGroupAPI } from "../../../helpers/APIs/GroupAPIs";
import { useNavigate } from "react-router-dom";
import Loading from "../../alerts/Loading";
import QRScanner from "../../QRComponent/QRScanner";
import ErrorAlert from "../../alerts/ErrorAlert";
import { useTranslation } from "react-i18next";

function JoinGroupDialog() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [openScan, setOpenScan] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState();
  const nav = useNavigate();

  const validationSchema = yup.object({
    code: yup.string().required(t("joinGroupDialog.codeRequired")),
  });

  const handleScannedCode = (code) => {
    setScannedCode(code);
    joinGroupRequest({ code });
    setOpenScan(false);
  };

  const handleScanAndDialogClose = () => {
    setOpenScan(false);
    setIsOpen(false);
  };

  const joinGroupRequest = async (form) => {
    setIsLoading(true);
    clearTimeout(timer);
    setErrorMessage("");

    const response = await JoinGroupAPI(form.code);
    console.log(response);
    
    if (response?.success) {
      nav("/main");
    } else {
      setErrorMessage(response?.message);
      let tId = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      setTimer(tId);
    }
    setIsLoading(false);
  };

  return (
    <>
      {errorMessage !== "" && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <ErrorAlert
            message={errorMessage}
            setErrorMessage={setErrorMessage}
            timer={timer}
          />
        </div>
      )}

      {isLoading && <Loading />}

      <div className="text-center">
        <button 
          onClick={() => setIsOpen(true)} 
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          {t("joinGroupDialog.join")}
        </button>
      </div>

      {isOpen && (
        <>
          {/* Transparent background with blur effect */}
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) handleScanAndDialogClose();
            }}
            className="fixed inset-0 bg-black h-full bg-opacity-70 backdrop-blur-sm z-40 flex items-center justify-center p-4"
          >
            {/* Dialog */}
            <div className="relative bg-[var(--dark)] rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
              
              <div className="relative z-10 p-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-400/10 rounded-full mb-4 border border-yellow-400/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {t("joinGroupDialog.enterCodeTitle")}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {t("joinGroupDialog.enterCodeInstructions", "Enter your invite code to join a group.")}
                  </p>
                </div>
                
                <Formik
                  initialValues={{ code: "" }}
                  validationSchema={validationSchema}
                  onSubmit={(values) => {
                    joinGroupRequest(values);
                  }}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-4">
                      <div>
                        <Field
                          placeholder={t("joinGroupDialog.enterCodePlaceholder", "Enter invite code")}
                          name="code"
                          autoFocus
                          className={`w-full rounded-lg bg-gray-700/50 border ${errors.code && touched.code ? 'border-red-500' : 'border-gray-600'} text-white px-4 py-3 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200`}
                        />
                        <ErrorMessage
                          name="code"
                          render={msg => (
                            <div className="text-red-400 text-xs mt-2 ml-2 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {t("joinGroupDialog.codeError", msg)}
                            </div>
                          )}
                        />
                      </div>
                      
                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                        >
                          {t("joinGroupDialog.submit", "Join Group")}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>

              
              </div>
              
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default JoinGroupDialog;