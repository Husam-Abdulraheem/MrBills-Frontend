import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Formik, Field, Form } from "formik";
import Footer from "../../layout/Footer";
import Header from "../../layout/Header";
import getProfileAPI, {
  updateProfileAPI,
  exitGroupProfileAPI,
} from "../../../helpers/APIs/ProfileAPI";
import ExitGroupDialog from "../../dialogs/profile/ExitGroupDialog";
import ExitErrorDialog from "../../dialogs/profile/ExitErrorDialog";
import ConfirmDialog from "../../dialogs/bills/ConfirmDialog";
import ErrorAlert from "../../alerts/ErrorAlert";
import SuccessAlert from "../../alerts/SuccessAlert";
import { ProfileContext } from "../../../helpers/Contexts/ProfileContext";
import { GroupContext } from "../../../helpers/Contexts/GroupContext";
import { useTranslation } from "react-i18next";
import Loading from "../../alerts/Loading";

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { profile, setProfile } = useContext(ProfileContext);
  const { setGroup } = useContext(GroupContext);

  const [profileInfo, setProfileInfo] = useState({
    fullName: "",
    email: "",
    iban: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profileInfo);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState();

  const schema = yup.object({
    fullName: yup
      .string()
      .min(3, t("fullNameMin", { count: 3 }))
      .required(t("fullNameRequired")),
    iban: yup
      .string()
      .min(14, t("ibanMin", { count: 14 }))
      .required(t("ibanRequired")),
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getProfileAPI();
        setProfileInfo({
          fullName: data.fullName,
          email: data.email,
          iban: data.iban,
        });
        setFormData({ fullName: data.fullName, iban: data.iban });
      } catch (err) {
        console.error(t("errorFetchingProfile"), err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [t]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setProfile(null);
    setGroup(null);
    navigate("/login", { replace: true });
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    handleLogout();
  };

  const handleSave = async () => {
    const updates = [
      { path: "/fullName", op: "replace", value: formData.fullName },
      { path: "/iban", op: "replace", value: formData.iban },
    ];
    try {
      await updateProfileAPI(updates);
      setProfileInfo({ ...profileInfo, ...formData });
      setIsEditing(false);
    } catch (err) {
      console.error(t("errorUpdatingProfile"), err);
    }
  };

  const handleExitConfirm = async () => {
    setIsLoading(true);
    const res = await exitGroupProfileAPI();
    setIsLoading(false);
    if (res.success) {
      setGroup(null);
      navigate("/group_selection");
    } else {
      setDialogOpen(false);
      setErrorMessage(
        res?.message ==
          "You can't exitfrom this group while you still have unpaid bills"
          ? t("closeAllInvoicesFirst")
          : res?.message
      );
      let tmr = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      setTimer(tmr);
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

      <div className="flex flex-col min-h-screen text-[var(--gray)]">
        <Header />

        {isLoading && <Loading />}

        <main className="flex-grow flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-md bg-[#171715] border border-gray-600 rounded-2xl shadow-lg overflow-hidden mx-2 sm:mx-4">
            <div className="bg-[#171715] py-4 sm:py-6 px-4 sm:px-8 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 sm:mb-4 bg-gray-700 rounded-full flex items-center justify-center text-xl sm:text-2xl md:text-4xl font-bold text-[var(--gray)]">
                {profileInfo.fullName
                  ? profileInfo.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "👤"}
              </div>
              <h2 className="text-white text-lg sm:text-xl md:text-2xl font-semibold">
                {profileInfo.fullName || t("loading")}
              </h2>
              <p className="text-gray-400 mt-1 text-xs sm:text-sm md:text-base">
                {profileInfo.email || t("loading")}
              </p>
            </div>

            <div className="p-3 sm:p-4 md:p-6">
              <Formik
                initialValues={formData}
                enableReinitialize
                validationSchema={schema}
                onSubmit={handleSave}
              >
                {({ errors, touched }) => (
                  <Form className="space-y-3 sm:space-y-4">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-xs sm:text-sm font-medium text-[var(--gray)] mb-1"
                        dir={i18n.language === "ar" ? "rtl" : "ltr"}
                      >
                        {t("fullName")}
                      </label>
                      <Field
                        id="fullName"
                        name="fullName"
                        disabled={!isEditing}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring ${
                          isEditing
                            ? "bg-[#171715] text-white"
                            : "bg-[#171715] text-[var(--gray)]"
                        } ${
                          errors.fullName && touched.fullName
                            ? "border-red-500"
                            : "border-gray-600"
                        }`}
                        dir={i18n.language === "ar" ? "rtl" : "ltr"}
                      />
                      {errors.fullName && touched.fullName && (
                        <div className="text-red-600 text-xs sm:text-sm mt-1">
                          {errors.fullName}
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="iban"
                        className="block text-xs sm:text-sm font-medium text-[var(--gray)] mb-1"
                        dir={i18n.language === "ar" ? "rtl" : "ltr"}
                      >
                        {t("iban")}
                      </label>
                      <Field
                        id="iban"
                        name="iban"
                        disabled={!isEditing}
                        onChange={(e) =>
                          setFormData({ ...formData, iban: e.target.value })
                        }
                        className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring ${
                          isEditing
                            ? "bg-[#171715] text-white"
                            : "bg-[#171715] text-[var(--gray)]"
                        } ${
                          errors.iban && touched.iban
                            ? "border-red-500"
                            : "border-gray-600"
                        }`}
                        dir={i18n.language === "ar" ? "rtl" : "ltr"}
                      />
                      {errors.iban && touched.iban && (
                        <div className="text-red-600 text-xs sm:text-sm mt-1">
                          {errors.iban}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 mt-4 sm:mt-6">
                      <button
                        type="button"
                        onClick={
                          isEditing ? handleSave : () => setIsEditing(true)
                        }
                        className="px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-2 bg-[var(--yellow)] text-[var(--dark)] text-xs sm:text-sm md:text-base rounded-full hover:opacity-90 focus:outline-none flex-1 sm:flex-none"
                      >
                        {isEditing ? t("saveChanges") : t("editProfile")}
                      </button>

                      <button
                        type="button"
                        onClick={() => setLogoutDialogOpen(true)}
                        className="px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-2 border border-red-600 text-red-600 text-xs sm:text-sm md:text-base rounded-full hover:bg-red-800 hover:bg-opacity-50 focus:outline-none flex-1 sm:flex-none mt-2 sm:mt-0"
                      >
                        {t("logout")}
                      </button>
                    </div>

                    <div className="mt-3 sm:mt-4 text-center">
                      <button
                        type="button"
                        onClick={() => setDialogOpen(true)}
                        className="inline-flex items-center text-xs sm:text-sm text-[var(--yellow)] hover:underline"
                      >
                        {t("exitGroup")}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3 sm:w-4 sm:h-4 ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M10 17l5-5-5-5v10z" />
                        </svg>
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          {error && (
            <ExitErrorDialog isOpen={error} onCancel={() => setError(false)} />
          )}
          {dialogOpen && (
            <ExitGroupDialog
              isOpen={dialogOpen}
              onConfirm={handleExitConfirm}
              onCancel={() => setDialogOpen(false)}
            />
          )}
          {logoutDialogOpen && (
            <ConfirmDialog
              isOpen={logoutDialogOpen}
              title={t("logout")}
              message={t("areYouSure")}
              onConfirm={handleLogoutConfirm}
              onCancel={() => setLogoutDialogOpen(false)}
            />
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}