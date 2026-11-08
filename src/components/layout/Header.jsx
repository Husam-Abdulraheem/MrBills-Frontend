import AddBillDialog from "../dialogs/bills/AddBillDialog";
import { useContext, useEffect , useRef , useState } from "react";
import { GroupContext } from "../../helpers/Contexts/GroupContext";
import getGroupAPI from "../../helpers/APIs/GroupAPIs";
import { useNavigate } from "react-router-dom";
import getProfileAPI from "../../helpers/APIs/ProfileAPI";
import { ProfileContext } from "../../helpers/Contexts/ProfileContext";

import Icon from "../../assets/icon.png"

import { useTranslation } from "react-i18next";

function Header(props) {

    const {group , setGroup } = useContext(GroupContext);
    const {profile , setProfile } = useContext(ProfileContext);

    
    const nav = useNavigate();
    useEffect(() =>{
        if( group != null && group != undefined && profile != null && profile != undefined){
            return;
        }else{
            const getGroupRequest = async () =>{
                const response  = await getGroupAPI();
                
                if(response?.success){  
                    if(response?.data?.length == 0 || response?.data == null || response?.data == undefined){
                        nav("/login");
                    }else{
                        setGroup(response?.data);
                    }
                 
                }else{
                    nav("/group_selection");
                }
            }

            const getProfileRequest = async () =>{

                const response = await getProfileAPI(); 
             
                if(response.success){
                    if(response?.data?.length == 0 || response?.data == null || response?.data == undefined){
                        nav("/login"); 
                    }else{
                        setProfile(response?.data);
                    }
                    
                   
                }else{
                    nav("/login");
                }
            }


            getProfileRequest();
            getGroupRequest();
        }
      
    },[group , profile ]);


    useEffect(()=>{
   
        if(group != null && group != undefined && profile != null && profile != undefined){
            
            if(group?.managerId == profile?.id && group?.isActive == false){
                
                
                nav("/renewal_subscription");
            }else if(group?.isActive == false){
                nav("/waiting");
            }else if(group == false){
                nav("/group_selection");
            } else if(group == false) {
                nav("/");
            }   
        }
        
        
        
                   
    },[group , profile ])



    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);
  
    // close when clicking outside
    useEffect(() => {
      const onClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", onClickOutside);
      return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);
  
    const changeLang = (lang) => {
      i18n.changeLanguage(lang);
      localStorage.setItem("language", lang);
      setIsOpen(false);
    };

   // Inverted dir: EN → rtl, AR → ltr
  useEffect(() => {
    const currentDir = i18n.dir(); // "ltr" for en, "rtl" for ar
    const inverted = currentDir === "ltr" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", inverted);
  }, [i18n.language]);

    return ( 
        <header className="w-full flex flex-wrap items-center px-2 py-3 text-[var(--gray)] justify-between gap-2">
  
  {/* Left Section */}
  <div className="flex items-center flex-shrink-0 gap-2 min-w-0">
    {/* Dropdown */}
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="relative z-10 p-2 bg-[var(--dark)] border border-transparent rounded-md focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371
             m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3
             m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502
             m9.334-12.138c.896.061 1.785.147 2.666.257
             m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-20 text-center origin-top-right bg-[var(--dark)] text-[var(--gray)] rounded-md shadow-xl z-20">
          {["en","ar", "tr"].map((lang) => (
            <button
              key={lang}
              onClick={() => changeLang(lang)}
              className="block w-full text-center px-4 py-2 text-sm capitalize hover:bg-gray-100"
            >
              {lang === "en" && "🇺🇸 EN"}
              {lang === "ar" && "🇸🇦 AR"}
              {lang === "tr" && "🇹🇷 TR"}
            </button>
          ))}
        </div>
      )}
    </div>

    {/* Add Bill */}
    <div className="flex items-center">
      <AddBillDialog refresh={props?.refresh} />
    </div>
  </div>

  {/* Right Section */}
  <div className="flex items-center gap-2 min-w-0 max-w-full">
    {/* Title */}
    <div className="flex items-center text-lg sm:text-xl flex-shrink min-w-0">
      <h1 className="font-bold bg-golden bg-clip-text text-transparent truncate">{t('header.mr', 'مستر')}</h1>
      <h1 className="me-1 truncate">{t('header.bills', 'فواتير')}</h1>
    </div>

    {/* Icon */}
    <div className="flex items-center">
      <div className="h-6 w-6 sm:h-7 sm:w-7 flex items-center">
        <img src={Icon} className="h-full w-full object-contain" alt="logo" />
      </div>
    </div>
  </div>
</header>

     );
}

export default Header;