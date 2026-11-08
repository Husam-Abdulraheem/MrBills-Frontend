import { useEffect, useRef, useState } from "react";
import { payBillAPI } from "../../../helpers/APIs/BillsAPIs";
import Loading from "../../alerts/Loading";
import ErrorAlert from "../../alerts/ErrorAlert";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

// FixedOverlay renders modal content outside the parent hierarchy.
function FixedOverlay({ children }) {
  const containerRef = useRef(document.createElement("div"));

  useEffect(() => {
    const container = containerRef.current;
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, []);

  return createPortal(children, containerRef.current);
}

// ErrorOverlay renders error alerts via a portal.
function ErrorOverlay({ children }) {
  const containerRef = useRef(document.createElement("div"));

  useEffect(() => {
    const container = containerRef.current;
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, []);

  return createPortal(children, containerRef.current);
}

// LoadingOverlay renders the Loading component via a portal.
function LoadingOverlay({ children }) {
  const containerRef = useRef(document.createElement("div"));

  useEffect(() => {
    const container = containerRef.current;
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, []);

  return createPortal(children, containerRef.current);
}

function PayBillDialog(props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const fileRef = useRef(null);
  const [isValidFile, setIsValidFile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState();
  const [trys, setTrys] = useState(0);

  const payBillRequest = async () => {
    if (props.isRequired === true) {
      setIsOpen(true);
      if (fileRef?.current?.files[0] && isValidFile) {
        setIsLoading(true);
        clearTimeout(timer);
        setErrorMessage("");

        const formData = new FormData();
        formData.append("BillId", props.id);
        formData.append("ReceiptFile", fileRef.current.files[0]);

        const response = await payBillAPI(formData);
        if (response.success) {
          console.log("Payment Successed");
          setIsLoading(false);
          setIsOpen(false);
          props.refresh && props.refresh();
        } else {
          console.log("Something went wrong");
          setIsLoading(false);
          setErrorMessage(
            t("payBillDialog.errorSomethingWentWrong", "Something went wrong")
          );
          let tId = setTimeout(() => {
            setErrorMessage("");
          }, 5000);
          setTimer(tId);
        }
      } else {
        if (trys !== 0) {
          setIsValidFile(false);
          setErrorMessage(
            t("payBillDialog.errorProvideFile", "Provide File First")
          );
          let tId = setTimeout(() => {
            setErrorMessage("");
          }, 5000);
          setTimer(tId);
        } else {
          setTrys(trys + 1);
        }
      }
    } else {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("BillId", props.id);

      const response = await payBillAPI(formData);
      if (response.success) {
        console.log("Payment Successed");
        setIsLoading(false);
        setIsOpen(false);
        props.refresh && props.refresh();
      } else {
        console.log("Something went wrong");
        setIsLoading(false);
        setErrorMessage(
          t("payBillDialog.errorSomethingWentWrong", "Something went wrong")
        );
        let tId = setTimeout(() => {
          setErrorMessage("");
        }, 5000);
        setTimer(tId);
      }
    }
  };

  function handleFile(e) {
    e.preventDefault();
    const file = fileRef?.current?.files[0];
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (file && allowedTypes.includes(file.type)) {
      if (file.size / (1024 * 1024) < 10) {
        console.log(file);
        setIsValidFile(true);
      } else {
        setIsValidFile(false);
        setErrorMessage(
          t(
            "payBillDialog.errorFileSize",
            "The file size is larger than 10 MB"
          )
        );
        let tId = setTimeout(() => {
          setErrorMessage("");
        }, 5000);
        setTimer(tId);
      }
    } else {
      setIsValidFile(false);
      setErrorMessage(
        t("payBillDialog.errorInvalidFile", "Invalid File")
      );
      let tId = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      setTimer(tId);
    }
  }

  return (
    <>
      {isLoading && (
        <LoadingOverlay>
          <Loading />
        </LoadingOverlay>
      )}
      {errorMessage !== "" && (
        <ErrorOverlay>
          <ErrorAlert
            message={errorMessage}
            setErrorMessage={setErrorMessage}
            timer={timer}
          />
        </ErrorOverlay>
      )}

      <div onClick={payBillRequest} className="w-1/3">
        <button className="p-5 py-7 bg-[#fab92d] w-full rounded-r-lg">
          {t("payBillDialog.payButton", "Pay")}
        </button>
      </div>

      {isOpen && (
        <FixedOverlay>
          <>
            {/* Transparent background */}
            <div
              onClick={() => setIsOpen(false)}
              className="fixed bg-black bg-opacity-80 top-0 left-0 right-0 w-full h-full content-center z-40 overflow-auto"
            ></div>

            {/* Dialog */}
            <div className="pop_up max-h-[60%] overflow-scroll text-white items-center justify-center py-7 text-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] border border-[var(--yellow)] rounded-2xl shadow-md z-50 bg-neutral-900 transition-all duration-300">
              <div>
                <h2 className="text-xl font-bold">
                  {t("payBillDialog.uploadTitle", "Upload Dekont")}
                </h2>
              </div>

              <div className="w-full flex justify-center">
                <label htmlFor="dekont">
                  <svg
                    className={
                      isValidFile
                        ? "size-24 text-[var(--yellow)]"
                        : "size-24 text-[var(--gray)]"
                    }
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16.5V9.75m0 0l3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                    />
                  </svg>
                </label>
                <input
                  onChange={handleFile}
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  id="dekont"
                  accept="image/*,.pdf"
                />
              </div>

              <div className="w-full line-clamp-1 overflow-hidden">
                {isValidFile && (
                  <h6 className="text-xs text-gray-400">
                    {fileRef?.current?.files[0]?.name}
                  </h6>
                )}
              </div>

              <div className="mt-2">
                <button
                  onClick={payBillRequest}
                  className="text-[var(--dark)] bg-[var(--yellow)] px-5 font-bold py-1 outline-none rounded-xl active:bg-[var(--yellowHover)]"
                >
                  {t("payBillDialog.uploadAndPay", "Upload and Pay")}
                </button>
              </div>

              <div className="mt-5">
                <h6 className="text-xs text-gray-400">
                  {t(
                    "payBillDialog.allowedFiles",
                    "Only pdf & images are allowed to upload."
                  )}
                </h6>
                <h6 className="text-xs text-gray-400">
                  {t(
                    "payBillDialog.maxFileSize",
                    "File size must be less than 2 MB."
                  )}
                </h6>
              </div>
            </div>
          </>
        </FixedOverlay>
      )}
    </>
  );
}

export default PayBillDialog;
