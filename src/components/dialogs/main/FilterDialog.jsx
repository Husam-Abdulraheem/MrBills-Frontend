import { useContext, useEffect, useRef, useState } from 'react';
import { GroupContext } from '../../../helpers/Contexts/GroupContext';
import { ProfileContext } from '../../../helpers/Contexts/ProfileContext';
import { useTranslation } from 'react-i18next';

function FilterDialog(props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [localMembers, setLocalMembers] = useState([]);
  const [username, setUsername] = useState("");
  const refList = useRef(null);

  useEffect(() => {
    setIsOpen(props.isOpen);
  }, [props.isOpen]);

  const { group } = useContext(GroupContext);
  const { profile } = useContext(ProfileContext);

  useEffect(() => {
    if (group != null && profile != null) {
      setLocalMembers(group?.members);
      setUsername(profile?.fullName);
    }
  }, [group, profile]);

  function handleFilter(target) {
    target.preventDefault();
    props?.filter(refList?.current?.value);
  }

  const dialogFunction = () => {
    setIsOpen(false);
    props.setListIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <>
          {/* Transparent background */}
          <div
            onClick={dialogFunction}
            className="fixed  bg-black bg-opacity-60 left-0 right-0 w-full h-full content-center z-50 overflow-auto"
          ></div>

          {/* Dialog */}
          <div className="pop_up fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-xs p-0 border-none rounded-2xl shadow-2xl z-[1000] bg-neutral-900 transition-all duration-300">
            <div className="flex flex-col md:flex-row w-full">
              {/* Left: Icon and Title */}
              <div className="flex flex-col items-center justify-center bg-[var(--lightDark)] rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none p-3 md:p-4 w-full md:w-1/3 border-b-2 md:border-b-0 md:border-r-2 border-[var(--yellow)]">
                <svg className="size-7 md:size-8 mb-1 text-[var(--yellow)]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" width="28" height="28" fill="currentColor">
                  <path d="M1595 295q17 41-14 70l-493 493v742q0 42-39 59-13 5-25 5-27 0-45-19l-256-256q-19-19-19-45v-486l-493-493q-31-29-14-70 17-39 59-39h1280q42 0 59 39z" />
                </svg>
                <h1 className="text-base md:text-lg font-bold text-[var(--yellow)] mb-0.5">{t("filterDialog.title", "Filter")}</h1>
                <span className="text-[10px] md:text-xs font-semibold text-white text-center">{t("filterDialog.subtitle", "Find Specific Bills")}</span>
              </div>
              {/* Right: Filter Controls */}
              <div className="flex flex-col flex-1 justify-center p-3 md:p-4 gap-2 md:gap-3">
                <div className="flex flex-col gap-0.5 md:gap-1">
                  <label htmlFor="owner-select" className="text-[var(--yellow)] text-xs font-semibold mb-0.5">{t("filterDialog.byOwner", "By Owner")}</label>
                  <select
                    id="owner-select"
                    ref={refList}
                    className="w-40 max-w-full bg-[var(--lightDark)] rounded-lg p-1 outline-none text-white border border-[var(--yellow)] focus:ring-2 focus:ring-[var(--yellow)] transition-all text-xs"
                  >
                    <option value="">{t("filterDialog.selectOwner", "Select Owner")}</option>
                    {localMembers?.length > 0 &&
                      localMembers.map((member, index) => {
                        if (member.fullName !== username) {
                          return (
                            <option key={index} value={member.fullName}>
                              {member.fullName}
                            </option>
                          );
                        }
                        return null;
                      })}
                  </select>
                </div>
                <button
                  onClick={handleFilter}
                  className="mt-2 bg-[var(--yellow)] text-black font-bold py-1.5 rounded-lg shadow hover:bg-[var(--yellowHover)] transition-all text-xs"
                >
                  {t("filterDialog.filterButton", "Filter")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default FilterDialog;
