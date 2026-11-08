import { useContext, useEffect, useState, useRef } from "react";
import Loading from "../../alerts/Loading";
import ParticipantEdit from "../../others/ParticipantEdit";
import { Form, Formik, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { editBillAPI } from "../../../helpers/APIs/BillsAPIs";
import Tooltip from "../../alerts/Tooltip";
import SuccessAlert from "../../alerts/SuccessAlert";
import ErrorAlert from "../../alerts/ErrorAlert";
import { GroupContext } from "../../../helpers/Contexts/GroupContext";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";

function EditBillDialog(props) {
  const { t } = useTranslation();
  
  const [isOpen, setIsOpen] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [timer, setTimer] = useState();

  const validationSchema = yup.object({
    description: yup
      .string()
      .max(64)
      .required(t("descriptionRequired")),
    total: yup
      .number()
      .typeError(t("totalNumber"))
      .min(0, t("totalNonNegative"))
      .required(t("totalRequired")),
    requiredReceipt: yup.boolean(),
  });

  const handleParticipants = (person) => {
    if (props?.bill?.claimants?.find((element) => element.claimantName === person)) {
      return { [`${person}`]: true };
    } else {
      return { [`${person}`]: false };
    }
  };

  const editBillRequest = async (form) => {
    clearTimeout(timer);
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    console.log(form);

    const content = {
      billId: props.bill.billId,
      description: form.description,
      total: form.total,
      claimants: Object.entries(form)
        .filter(([key, value]) => value === true)
        .map(([key]) => ({ claimantName: key })),
    };

    const response = await editBillAPI(content);

    if (response.success) {
      setIsLoading(false);
      setIsOpen(false);
      setSuccessMessage(t("billEditedSuccess"));
      let timerId = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      setTimer(timerId);
      props?.refresh();
    } else {
      setIsLoading(false);
      setErrorMessage(response?.message || t("somethingWentWrong"));
      let timerId = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      setTimer(timerId);
    }
  };

  const { group } = useContext(GroupContext);
  useEffect(() => {
    if (group != null) {
      setParticipants(group?.members);
    }
  }, [group]);

  return (
    <>
      {errorMessage !== "" && <ErrorAlert message={errorMessage} setErrorMessage={setErrorMessage} timer={timer} />}
      {successMessage !== "" && <SuccessAlert message={successMessage} setSuccessMessage={setSuccessMessage} timer={timer} />}
      {props.bill.activityLogs?.length === 0 ? (
        <p className="text-md opacity-60" onClick={() => setIsOpen(true)}>
          {t("edit")}
        </p>
      ) : (
        <Tooltip message={t("billLockedTooltip")}>
          <p className="text-md opacity-60">{t("edit")}</p>
        </Tooltip>
      )}
      {isLoading && <Loading />}

      {isOpen && createPortal(
        <>
          {/* Transparent background */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed bg-black bg-opacity-80 top-0 left-0 right-0 w-full h-full content-center z-40 overflow-auto"
          ></div>

          {/* Dialog */}
          <div className="pop_up fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] py-2 px-4 border border-[var(--yellow)] rounded-2xl shadow-md z-50 bg-neutral-900 transition-all duration-300 text-white">
            <Formik
              initialValues={participants?.reduce(
                (acc, element) => {
                  return { ...acc, ...handleParticipants(element.fullName) };
                },
                {
                  description: props.bill.description,
                  total: props.bill.total,
                  requiredReceipt: false,
                }
              )}
              validationSchema={validationSchema}
              onSubmit={(e) => {
                editBillRequest(e);
              }}
            >
              {({ isSubmiting }) => (
                <Form className="text-white">
                  {/* Upper Part */}
                  <div className="w-100 flex items-center justify-center gap-6 py-3 my-2">
                    {/* Description & Total Price */}
                    <div className="w-2/3 line-clamp-1">
                      <Field
                        name="description"
                        className="text-md w-full font-bold rounded-lg bg-[var(--gray)] outline-none placeholder:text-center text-black text-center"
                        placeholder={t("description")}
                      />
                    </div>

                    <div className="w-1/3 line-clamp-1">
                      <Field
                        name="total"
                        className="text-md w-full font-bold rounded-lg bg-[var(--gray)] outline-none placeholder:text-center text-black text-center"
                        placeholder={t("total")}
                      />
                    </div>
                  </div>

                  <hr className="bg-white w-full my-2" />

                  <div className="flex">
                    {/* Participants */}
                    <div className="w-[55%] border-white border-r-2">
                      {participants?.map((participant, index) => {
                        if (
                          props?.bill?.claimants.filter(
                            (claimant) => claimant.claimantName === participant.fullName
                          )?.length > 0
                        ) {
                          return (
                            <ParticipantEdit
                              key={index}
                              state={true}
                              isEdit={true}
                              participant={participant}
                              claimanst={props?.bill?.claimants}
                            />
                          );
                        } else {
                          return (
                            <ParticipantEdit
                              key={index}
                              state={false}
                              isEdit={true}
                              participant={participant}
                              claimanst={props?.bill?.claimants}
                            />
                          );
                        }
                      })}
                    </div>

                    {/* Optional Settings section */}
                    <div className="w-[45%]">
                      <h1 className="text-sm font-bold text-center my-2">{t("optionalSettings")}</h1>

                      {/* Force Dekont */}
                      <div className="flex gap-1 mx-2 my-2 text-end justify-end">
                        <input type="checkbox" id="force_dekont" className="accent-[var(--yellow)] me-1" />
                        <label className="text-xs" htmlFor="force_dekont">
                          {t("forceDekont")}
                        </label>
                       
                      </div>


                    </div>
                  </div>

                  <hr className="bg-white w-full my-3" />

                  <div className="w-full text-center my-2">
                    <input
                      disabled={isSubmiting}
                      type="submit"
                      value={t("submit")}
                      className="bg-[var(--yellow)] p-1 active:bg-[var(--yellowHover)] text-black rounded-3xl px-7"
                    />
                  </div>

                  {/* Errors */}
                  <div className="w-full text-end">
                    <ErrorMessage name="description" component="div" className="text-red-500 text-xs my-2" />
                    <ErrorMessage name="total" component="div" className="text-red-500 text-xs w-full my-2" />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

export default EditBillDialog;
