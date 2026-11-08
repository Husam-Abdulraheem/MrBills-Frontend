import Footer from "../../layout/Footer";
import Header from "../../layout/Header";
import { useContext, useEffect, useState } from "react";
import getGroupAPI, {
  getSubscriptionAPI,
  kickMemberAPI,
} from "../../../helpers/APIs/GroupAPIs";
import GroupQRCode from "../../QRComponent/GroupQRCode";
import { GroupContext } from "../../../helpers/Contexts/GroupContext";
import SureDialog from "../../dialogs/group/SureDialog";
import ErrorAlert from "../../alerts/ErrorAlert";
import SuccessAlert from "../../alerts/SuccessAlert";
import { ProfileContext } from "../../../helpers/Contexts/ProfileContext";
import Loading from "../../alerts/Loading";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function GroupPage() {
  const { t, i18n } = useTranslation();
  const [members, setMembers] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState();

  const { group, setGroup } = useContext(GroupContext);
  const { profile } = useContext(ProfileContext);

  useEffect(() => {
    if (group != null && profile != null) {
      console.log(group);

      setMembers(group?.members);
    } else {
      getGroupRequest();
    }
  }, [group]);

  const kickMemberRequest = async (id) => {
    setIsLoading(true);
    const response = await kickMemberAPI(id);
    if (response.success) {
      getGroupRequest();
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setErrorMessage(response?.message === "You can't remove a member while they still have unpaid bills"
        ? t("closeAllInvoicesFirst")
        : response?.message || t("unknownError"));
      
      let tmr = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      setTimer(tmr);
    }
  };

  const getGroupRequest = async () => {
    setIsLoading(true);
    const response = await getGroupAPI();
    if (response.success) {
      setGroup(response?.data);
    }
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(group?.code)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      })
      .catch((err) => console.error("Failed to copy text:", err));
  };

  const nav = useNavigate();

  useEffect(() => {
    const subscriptionRequest = async () => {
      setIsLoading(true);
      const response = await getSubscriptionAPI();
      if (response.success) {
        setSubscription(response.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        nav("/");
      }
    };

    if (subscription == null) {
      subscriptionRequest();
    }
  }, [subscription]);

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
      <Header />
      {isLoading && <Loading />}
      <main
        className="min-h-screen w-full text-gray-200 p-6 flex flex-col items-center"
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-yellow-400/5 to-yellow-600/5 blur-3xl -z-10 pointer-events-none"></div>

        <div
          className="w-full max-w-4xl space-y-6 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 220px)" }}
        >
          {/* Members Section */}
          <section className="w-full bg-[var(--dark)] rounded-2xl p-6 shadow-2xl border border-yellow-500/30">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {t("groupPage.membersTitle", "Group Members")}
              </h1>
              <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-sm">
                {members?.length} {t("groupPage.members", "Members")}
              </span>
            </div>

            <ul className="space-y-3">
              {members?.map((member, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-700/50 hover:bg-gray-700/70 px-4 py-3 rounded-xl transition-all duration-200"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center mr-3">
                      <span className="text-yellow-400 font-semibold">
                        {member.fullName.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium">
                      {member.fullName}{" "}
                      {member.userId === profile.id &&
                        `(${t("groupPage.me", "me")})`}
                    </span>
                  </div>
                  {member.userId !== profile.id && (
                    <SureDialog func={() => kickMemberRequest(member.userId)} />
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* Add Friend Section */}
          <section className="w-full bg-[var(--dark)] border border-yellow-500/30 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              {t("groupPage.addFriendTitle", "Add a New Friend")}
            </h2>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col items-center w-full md:w-auto">
                <strong className="text-lg mb-2">
                  {t("groupPage.codeTitle", "Group Code")}
                </strong>
                <div
                  className={`flex items-center bg-gray-700/50 border ${
                    copied ? "border-green-500" : "border-yellow-500/50"
                  } px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gray-700/70 w-full justify-center`}
                  onClick={handleCopy}
                >
                  <span
                    className={`font-mono text-lg ${
                      copied ? "text-green-400" : "text-yellow-400"
                    }`}
                  >
                    {copied ? t("groupPage.copied", "Copied!") : group?.code}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ml-2 ${
                      copied ? "text-green-400" : "text-yellow-400"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  {t(
                    "groupPage.codeInstructions",
                    "Share this code with friends to join your group"
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* Subscription Section */}
          <section className="w-full bg-[var(--dark)] border border-yellow-500/30 rounded-2xl p-6 shadow-2xl mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              {t("groupPage.subscriptionTitle", "Subscription Plan")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/30 p-4 rounded-xl">
                <h3 className="text-lg font-medium text-yellow-400 mb-2">
                  {t("groupPage.planDetails", "Plan Details")}
                </h3>
                <p className="text-2xl font-bold mb-2">
                  {subscription?.type == 0 ? "∞" : subscription?.daysLeft}
                  <span className="text-sm font-normal text-gray-400 ml-1">
                    {t("groupPage.daysLeft", "Days Left")}
                  </span>
                </p>
                <p className="text-sm text-gray-300">
                  {subscription?.package === 0 &&
                    t("groupPage.smallPack", {
                      members: members?.length,
                      limit: 3,
                    })}
                  {subscription?.package === 1 &&
                    t("groupPage.mediumPack", {
                      members: members?.length,
                      limit: 5,
                    })}
                  {subscription?.package === 2 &&
                    t("groupPage.largePack", {
                      members: members?.length,
                      limit: 7,
                    })}
                </p>
              </div>

              {subscription?.type == 1 && (
                <>
                  <div className="bg-gray-700/30 p-4 rounded-xl">
                    <h3 className="text-lg font-medium text-yellow-400 mb-2">
                      {t("groupPage.usage", "Usage")}
                    </h3>
                    <div className="w-full bg-gray-600 rounded-full h-3 mt-2">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            ((members?.length || 0) /
                              (subscription?.package === 0
                                ? 3
                                : subscription?.package === 1
                                ? 5
                                : 7)) *
                              100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-300 mt-2">
                      {members?.length || 0} /{" "}
                      {subscription?.package === 0
                        ? 3
                        : subscription?.package === 1
                        ? 5
                        : 7}{" "}
                      {t("groupPage.members", "Members")}
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default GroupPage;
