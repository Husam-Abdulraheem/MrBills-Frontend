import {  useRef, useState } from "react";
import { renewalSubscriptionWebAPI } from "../../../helpers/APIs/SubscriptionAPIs";
import { useNavigate } from "react-router-dom";
import Loading from "../../alerts/Loading";
import ErrorAlert from "../../alerts/ErrorAlert";
import { GroupContext } from "../../../helpers/Contexts/GroupContext";
import { ProfileContext } from "../../../helpers/Contexts/ProfileContext";
import { useContext } from "react";

function PayDialog() {
    
    const [isOpen, setIsOpen] = useState(false);

    const [copied, setCopied] = useState(false);
    
    const fileRef = useRef(null)

    const [isValidFile , setIsValidFile] = useState(false)
    
    const [isLoading , setIsLoading] = useState(false)
    const [errorMessage , setErrorMessage] = useState("");
    const [timer , setTimer] = useState();
    
    const nav = useNavigate();

    const { setGroup } = useContext(GroupContext);
    const {setProfile } = useContext(ProfileContext);

    const handleRequest = async () => {

        if(isValidFile){
            setIsLoading(true);
            const formData = new FormData();
            formData.append("Receipt", fileRef.current.files[0]); 
        
            const response = await renewalSubscriptionWebAPI(formData);
            
            if(response?.success){
                setIsLoading(false);
                setGroup(null);
                setProfile(null);
                nav("/main");
            }else{
                setIsLoading(false);
                setErrorMessage("Something went wrong");
                let t = setTimeout(() => {
                    setErrorMessage("");
                },5000);
                setTimer(t);
            }
        }
        
    }

    function handleFile(target) {
        target.preventDefault(); 
        const file = fileRef?.current?.files[0];
        const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/gif", "image/webp"];

        if(file && allowedTypes.includes(file.type) ){
            if((file.size / (1024 * 1024)) < 10){
                console.log(file);
                setIsValidFile(true);
            }else{
                setIsValidFile(false);
                setErrorMessage("حجم الملف أكبر من 10 ميجا بايت" );
                let t = setTimeout(() => {
                    setErrorMessage("");
                },5000);
                setTimer(t);
            }
          
        }else{
            setIsValidFile(false);
            setErrorMessage("ملف غير صالح" );
            let t = setTimeout(() => {
                setErrorMessage("");
            },5000);
            setTimer(t);
        }
    }

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
          .then(() => {
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 3000);
          })
          .catch(err => console.error("Failed to copy text:", err));
      };

    
    return ( 
        <>
        
        {isLoading && <Loading />}
        {errorMessage != "" && <ErrorAlert message={errorMessage} setErrorMessage={setErrorMessage} timer={timer} />}
        <button onClick={() =>setIsOpen(true)}  className="inline-flex items-center justify-center px-4 py-2 font-medium text-[var(--dark)] uppercase transition-colors bg-[var(--yellow)] rounded-lg active:bg-[var(--yellowHover)] focus:outline-none">
            Subscribe
        </button>
    
        {isOpen && (

            <>
                {/* Transparent background */}
                <div onClick={() => setIsOpen(false)} className="fixed  bg-black  bg-opacity-20 top-0 left-0 right-0 w-full h-full content-center   z-40 overflow-auto mt-0" ></div>
                
                {/* Dialog */}
                <div  className="pop_up  fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] py-4 px-4 border border-[var(--yellow)] rounded-2xl  shadow-md z-50   bg-neutral-900 transition-all duration-300">

                    <div>
                       <h2 className="text-xl font-bold"> ارفع الايصال </h2>
                    </div>
                    
                    <div className="my-7 w-full text-start  ">
                        <label className="ps-1"> IBAN</label>
                        <div disabled={true}    className="relative w-full text-sm bg-white bg-opacity-0 border-b outline-none placeholder:text-[var(--gray)] placeholder:ps-1 pb-1 mt-2 "   >
                            TR16 0001 0090 1008 6593 4050 04
                        {copied ?  
                            <svg className="size-5 absolute right-0 top-0 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                            :
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            className="size-5 absolute right-0 top-0 "
                            fill="white" onClick={() => handleCopy("TR16 0001 0090 1008 6593 4050 04")}>
                            <path d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l140.1 0L400 115.9 400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-204.1c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-32-48 0 0 32c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l32 0 0-48-32 0z" />
                            </svg>
                        }
                        </div>
                    </div>

                    <div className="my-7 w-full text-start">
                        <label className="ps-1"> الاسم</label>
                        <div disabled={true}    className="relative w-full text-sm bg-white bg-opacity-0 border-b outline-none placeholder:text-[var(--gray)] placeholder:ps-1 pb-1 mt-2 "   >
                            Husam Taher Abbas Abdulraheem
                            {copied ?  
                                <svg className="size-5 absolute right-0 top-0 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                                :
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                                className="size-5 absolute right-0 top-0 "
                                fill="white" onClick={() => handleCopy("Husam Taher Abbas Abdulraheem")}>
                                <path d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l140.1 0L400 115.9 400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-204.1c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-32-48 0 0 32c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l32 0 0-48-32 0z" />
                                </svg>
                            }
                            </div>
                    </div>


                    <div className="w-full flex justify-center items-center gap-5  ">
                        <label htmlFor="dekont">
                            <svg className={ isValidFile ? "size-16 text-[var(--yellow)] "  : "size-16 text-[var(--gray)]" }  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                            </svg>
                        </label>
                        <input onChange={handleFile} ref={fileRef} type="file" className="hidden " id="dekont" />

                        <label htmlFor="dekont"> تحميل الإيصال<span className="text-red-500 ">*</span> </label>
                    </div>

                    <div className="w-full line-clamp-1  overflow-hidden">
                        {isValidFile &&  <h6 className="text-xs text-gray-400  ">{ fileRef?.current?.files[0]?.name}</h6> }
                       
                    </div>
                    <div className="mt-5">
                        <button onClick={handleRequest} className="text-[var(--dark)] bg-[var(--yellow)] px-5 font-bold py-1 outline-none rounded-xl"> Submit</button>
                    </div>


                    <div className="mt-5  text-start   ">
                        <li className="text-[10px] text-gray-400 ">تستغرق عملية الفحص عادة من 1 إلى 3 أيام. </li>
                        <li className="text-[10px] text-gray-400 ">إذا كان الدفع غير صالح فسوف نقوم بإغلاق حسابك.</li>
                        <li className="text-[10px] text-gray-400 ">بعد تحميل الإيصال سيتم بدء اشتراكك على الفور.</li>
                        
                    </div>


                   
                    
                    
                </div>
            </>
        )} 
       </>
    );
}

export default PayDialog;