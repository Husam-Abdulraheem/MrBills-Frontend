import { useEffect } from "react";
import JoinGroupDialog from "../dialogs/group/JoinGroupDialog";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import getGroupAPI from "../../helpers/APIs/GroupAPIs";

function GroupSelectionPage() {
  const { t } = useTranslation();
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      nav('/login', { replace: true });
      return;
    }

    const getGroupRequest = async () => {
      try {
        const response = await getGroupAPI();
        console.log(response);

        if (response?.success) {
          nav("/main");
        } else if (response?.success === false) {
          // Stay on current page
        } else {
          nav("/login");
        }
      } catch (error) {
        localStorage.removeItem('token'); // Clear invalid token
        nav('/login', { replace: true });
      }
    };

    getGroupRequest();
  }, [nav]);

 const handleLogout = () => {
    localStorage.removeItem('token');
    nav('/login');
  };

  return (

    <main className="min-h-screen flex flex-col items-center justify-center bg-black/90 py-12 px-4 relative">
      {/* Logout button at top-right */}
      <button
        className="absolute top-6 right-6 text-[var(--yellow)] font-bold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 text-sm uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 z-50"
        onClick={handleLogout}
        style={{ minWidth: 120 }}
      >
        {t("logout")}
      </button>
      <div className="w-full max-w-3xl mx-auto mb-6 mt-3 text-center">
        <h1 className="text-2xl font-extrabold text-yellow-400 mb-4 tracking-tight">
          {t("groupSelection.title", "Select Group Option")}
        </h1>
        <p className="text-base text-gray-300 mb-2">
          {t("groupSelection.subtitle", "Create a new group or join an existing one to get started.")}
        </p>
      </div>
      <div className="w-full max-w-4xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black rounded-3xl shadow-2xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-3 md:gap-3 justify-between border border-zinc-800">
        {/* Create Group Section */}
        <div className="flex-1 flex flex-col items-center text-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-700/10 rounded-full p-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="44" height="44" fill="#fab92d">
                <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1z" />
              </svg>
            </div>
            <h3 className="text-base font-extrabold text-white tracking-tight mb-1">
              {t("groupSelection.create")}
            </h3>
            <p className="text-sm text-yellow-300 max-w-xs">
              {t("groupSelection.createDescription")}
            </p>
          </div>
          <Link to="/subscription" className="mt-2">
            <button className="bg-[var(--yellow)] hover:bg-[var(--yellow)] text-[var(--dark)] font-bold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 text-lg uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
              {t("groupSelection.createButton", "Create Group")}
            </button>
          </Link>
        </div>
        {/* Divider */}
        <div className="mx-4 flex flex-col items-center">
          <span className="text-gray-400 font-bold text-base mb-1 md:mb-0 md:text-lg">{t("groupSelection.or")}</span>
          <div className="hidden md:block w-0.5 h-20 bg-gradient-to-b from-yellow-500/40 to-transparent mt-1"></div>
          <div className="block md:hidden w-20 h-0.5 bg-gradient-to-r from-yellow-500/40 to-transparent my-2"></div>
        </div>
        {/* Join Group Section */}
        <div className="flex-1 flex flex-col items-center text-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-700/10 rounded-full p-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fab92d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" /></svg>
            </div>
            <h3 className="text-base font-extrabold text-white tracking-tight mb-1">
              {t("groupSelection.join")}
            </h3>
            <p className="text-sm text-yellow-300 max-w-xs">
              {t("groupSelection.joinDescription", "Join an existing group using an invite code.")}
            </p>
          </div>
          <div className="mt-2 w-full flex justify-center">
            <JoinGroupDialog />
          </div>
        </div>
      </div>

    </main>
  );
}

export default GroupSelectionPage;
