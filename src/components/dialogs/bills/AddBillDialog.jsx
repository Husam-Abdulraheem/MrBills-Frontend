import { useContext, useEffect, useRef, useState } from "react";
import ParticipantEdit from "../../others/ParticipantEdit";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { createBillAPI } from "../../../helpers/APIs/BillsAPIs";
import Loading from "../../alerts/Loading";
import ErrorAlert from "../../alerts/ErrorAlert";
import SuccessAlert from "../../alerts/SuccessAlert";
import { GroupContext } from "../../../helpers/Contexts/GroupContext";
import { useTranslation } from "react-i18next";
import { FaPlusCircle } from "react-icons/fa";
import TutorialsDialog from "../TutorialsDialog";
import AddBillVideo from "../../../assets/videos/addBill.mp4";
function AddBillDialog(props) {
  const { t, i18n } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [timer, setTimer] = useState();
  const [participants, setParticipants] = useState([]);
  const refFile = useRef(null);
  const [file, setFile] = useState(null);

  const validationSchema = yup.object({
    description: yup.string().max(64).required(t("descriptionRequired")),
    total: yup
      .number()
      .typeError(t("totalMustBeNumber"))
      .min(0, t("totalNonNegative"))
      .required(t("totalRequired")),
    requiredReceipt: yup.boolean(),
  });

  const addBillRequest = async (form) => {
    try {
      setIsLoading(true);
      clearTimeout(timer);
      setErrorMessage("");
      setSuccessMessage("");

      const formParticipants = Object.entries(form);
      const members = participants;
      let ids = [];

      formParticipants.map((participant) => {
        if (
          participant[1] === true &&
          participant[0] !== "description" &&
          participant[0] !== "total" &&
          participant[0] !== "requiredReceipt"
        ) {
          ids.push(
            members
              ?.filter((member) => member.fullName === participant[0])[0]
              ?.userId.toString()
          );
        }
      });

      const formData = new FormData();
      formData.append("Description", form.description);
      formData.append("Total", form.total);
      formData.append("RequiredReceipt", form.requiredReceipt);

      ids.forEach((e) => {
        formData.append("BillUsersId", e);
      });

      if (file != null) {
        formData.append("Invoice", file);
      }
      const response = await createBillAPI(formData);

      if (response?.success) {
        setIsOpen(false);
        setIsLoading(false);
        setSuccessMessage(t("billAddedSuccess"));
        let tmr = setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
        setTimer(tmr);
        props?.refresh();
      } else {
        setIsLoading(false);
        setErrorMessage(response?.message || t("reachedBillingLimitWeekOrError"));
        let tmr = setTimeout(() => {
          setErrorMessage("");
        }, 5000);
        setTimer(tmr);
      }
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(t("somethingWentWrong"));
      let tmr = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      setTimer(tmr);
    }
  };

  const { group } = useContext(GroupContext);
  useEffect(() => {
    if (group != null) {
      setParticipants(group?.members);
    }
  }, [group]);

  const handleFile = () => {
    if (refFile?.current?.files[0].size / (1024 * 1024) < 10) {
      setFile(refFile?.current?.files[0]);
    } else {
      setErrorMessage(t("fileTooLarge"));
      let tmr = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      setTimer(tmr);
      setFile(null);
    }
  };

  return (
    <>
      {errorMessage !== "" && (
        <ErrorAlert
          message={errorMessage}
          setErrorMessage={setErrorMessage}
          timer={timer}
        />
      )}
      {successMessage !== "" && (
        <SuccessAlert
          message={successMessage}
          setSuccessMessage={setSuccessMessage}
          timer={timer}
        />
      )}
      {isLoading && <Loading />}

<div
  className="relative shining-border rounded-full cursor-pointer inline-block"
  onClick={() => setIsOpen(true)}
  dir="rtl"
>
  <div className="content bg-yellow-500 rounded-full px-6 py-2">
    <FaPlusCircle className="w-6 h-6" aria-hidden="true" />
    <span>{t("addInvoice") || "اضف فاتورة"}</span>
  </div>
</div>

      {isOpen && (
        <>
          {/* Transparent background */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed bg-black bg-opacity-80 top-0 left-0 right-0 w-full h-full content-center z-40 overflow-auto"
          ></div>

          {/* Dialog */}
          <div className="pop_up fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] border border-[var(--yellow)] py-2 px-4 rounded-2xl shadow-md z-50 bg-neutral-900 transition-all duration-300">
            <TutorialsDialog
              style={"size-7 absolute bottom-3 end-4 "}
              video={AddBillVideo}
              title={t(
                "addBillDialog.tutorialTitle",
                "كيفية إضافة فاتورة جديدة"
              )}
              description={t(
                "addBillDialog.tutorial",
                "لإضافة فاتورة، يُرجى ملء خانة الوصف وإجمالي السعر، ثم تحديد الأعضاء المشاركين في الفاتورة."
              )}
            />
            <Formik
              initialValues={{
                description: "",
                total: "",
                requiredReceipt: false,
              }}
              validationSchema={validationSchema}
              onSubmit={(e) => {
                addBillRequest(e);
              }}
            >
              {({ isSubmiting }) => (
                <Form>
                  <div className="bg-black shadow-xl rounded-2xl p-2 sm:p-3 md:p-4 max-w-3xl mx-auto w-full text-white max-h-screen overflow-y-auto min-h-[40vh]">
                    {/* Header */}
                    <div className="mb-3 text-center">
                      <h2 className="text-2xl font-bold text-white-400 mb-2">
                        {t("addBillDialog.addBill")}
                      </h2>
                      <p className="text-white-200 text-sm">
                        {t("addBillDialog.fillBillDetails")}
                      </p>
                    </div>

                    {/* Description & Total */}
                    <div className="flex flex-row flex-wrap gap-2 md:gap-4 mb-4 w-full">
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium text-white-200 mb-1"
                          htmlFor="description"
                        >
                          {t("description")}
                        </label>
                        <Field
                          name="description"
                          id="description"
                          className="block w-full rounded-lg border border-white-400 bg-black py-2 px-3 text-white-100 focus:ring-2 focus:ring-white-400 focus:border-white-400 placeholder:text-white-300 text-md shadow-sm"
                          placeholder={t("description")}
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-red-400 text-xs mt-1"
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium text-white-200 mb-1"
                          htmlFor="total"
                        >
                          {t("total")}
                        </label>
                        <Field
                          name="total"
                          id="total"
                          className="block w-full rounded-lg border border-white-400 bg-black py-2 px-3 text-white-100 focus:ring-2 focus:ring-white-400 focus:border-white-400 placeholder:text-white-300 text-md shadow-sm"
                          placeholder={t("total")}
                        />
                        <ErrorMessage
                          name="total"
                          component="div"
                          className="text-red-400 text-xs mt-1"
                        />
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center mb-4">
                      <div className="flex-grow border-t border-white-600"></div>
                      <span className="mx-4 text-[var(--yellow)] text-xs uppercase tracking-widest">
                        {t("addBillDialog.participantsAndSettings")}
                      </span>
                      <div className="flex-grow border-t border-white-600"></div>
                    </div>

                    {/* Participants & Settings */}
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Participants */}
                      <div className="flex-1">
                        <h3 className="text-md font-semibold text-[var(--yellow)] mb-3">
                          {t("addBillDialog.participants")}
                        </h3>
                        <div className="space-y-2">
                          {participants?.length > 0 ? (
                            participants?.map((participant, index) => (
                              <ParticipantEdit
                                key={index}
                                participant={participant}
                              />
                            ))
                          ) : (
                            <div className="text-white-600 text-xs">
                              {t("noParticipants")}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Optional Settings */}
                      <div className="flex-1">
                        <h3 className="text-md font-semibold text-[var(--yellow)] mb-3">
                          {t("optionalSettings")}
                        </h3>
                        {/* Force Dekont */}
                        <div className="flex items-center mb-4">
                          <Field
                            name="requiredReceipt"
                            type="checkbox"
                            id="requiredReceipt"
                            className="accent-[var(--yellow)] h-4 w-4"
                          />
                          <label
                            className="ml-2 text-sm text-[var(--yellow)]"
                            htmlFor="requiredReceipt"
                          >
                            {t("forceDekont")}
                          </label>
                        </div>
                        {/* Upload Photo */}
                        <div className="flex items-center mb-4">
                          <label
                            htmlFor="bill_photo"
                            className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                              file != null
                                ? "bg-green-400 text-black"
                                : "bg-yellow-400 text-black"
                            }`}
                          >
                            <svg
                              className="w-5 h-5 mr-2"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                              />
                            </svg>
                            <span>{t("uploadInvoice")}</span>
                          </label>
                          <input
                            onChange={handleFile}
                            ref={refFile}
                            type="file"
                            id="bill_photo"
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-4 flex justify-center">
                      <button
                        type="submit"
                        disabled={isSubmiting}
                        className="inline-flex items-center px-8 py-2 rounded-full text-md font-semibold shadow-sm bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-black transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      >
                        {t("submit")}
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </>
      )}
    </>
  );
}

export default AddBillDialog;
