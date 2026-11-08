import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { GroupContext } from "../../helpers/Contexts/GroupContext";
import { ProfileContext } from "../../helpers/Contexts/ProfileContext";
import { useTranslation } from "react-i18next";

function Footer() {
    const { t } = useTranslation();
    const {group  } = useContext(GroupContext);
    const {profile  } = useContext(ProfileContext);
    return ( 
        <>
        <footer className="absolute z-10 bottom-0 flex items-center px-3 justify-between h-[10%] w-full text-[var(--gray)] rounded-t-lg   ">

            <NavLink to={"/main"} className={({ isActive }) =>
    isActive
        ? "bg-[var(--yellow)] rounded-2xl text-black p-2 flex flex-col items-center shadow-lg border-2 border-[var(--yellow)] transition-all"
        : "bg-transparent p-2 flex flex-col items-center text-[var(--gray)] hover:bg-[var(--yellow)] hover:text-black rounded-2xl transition-all"
} >
                <svg className="size-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" >
                    <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                    <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                </svg>
                <span className="text-xs mt-1 font-semibold">{t("footer.home", "Home")}</span>
            </NavLink>

            <NavLink to={"/bills"} className={({ isActive }) =>
    isActive
        ? "bg-[var(--yellow)] rounded-2xl text-black p-2 flex flex-col items-center shadow-lg border-2 border-[var(--yellow)] transition-all"
        : "bg-transparent p-2 flex flex-col items-center text-[var(--gray)] hover:bg-[var(--yellow)] hover:text-black rounded-2xl transition-all"
} >
                <svg className="size-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" >
                    <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
                    <path fillRule="evenodd" d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087ZM12 10.5a.75.75 0 0 1 .75.75v4.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72v-4.94a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                </svg>
                <span className="text-xs mt-1 font-semibold">{t("footer.bills", "Bills")}</span>
            </NavLink>

            { group != null && group?.managerId == profile?.id && 
                <NavLink to={"/group"} className={({ isActive }) =>
    isActive
        ? "bg-[var(--yellow)] rounded-2xl text-black p-2 flex flex-col items-center shadow-lg border-2 border-[var(--yellow)] transition-all"
        : "bg-transparent p-2 flex flex-col items-center text-[var(--gray)] hover:bg-[var(--yellow)] hover:text-black rounded-2xl transition-all"
} >
                    <svg className="size-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" >
                        <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
                        <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                    </svg>
                    <span className="text-xs mt-1 font-semibold">{t("footer.group", "Group")}</span>
                </NavLink>
            }

            <NavLink to={"/profile"} className={({ isActive }) =>
    isActive
        ? "bg-[var(--yellow)] rounded-2xl text-black p-2 flex flex-col items-center shadow-lg border-2 border-[var(--yellow)] transition-all"
        : "bg-transparent p-2 flex flex-col items-center text-[var(--gray)] hover:bg-[var(--yellow)] hover:text-black rounded-2xl transition-all"
} >
                <svg className="size-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" >
                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-xs mt-1 font-semibold">{t("footer.profile", "Profile")}</span>
            </NavLink>
        </footer>
        </>
     );
}

export default Footer;