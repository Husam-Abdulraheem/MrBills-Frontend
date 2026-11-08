import { useEffect, useRef, useState } from "react";
import ArchivedBillView from "../../bills/ArchivedBillView";
import MyBillView from "../../bills/MyBillView";
import Footer from "../../layout/Footer";
import Header from "../../layout/Header";
import { AiFillCaretDown, AiFillCaretRight } from "react-icons/ai";
import { archivedBillsAPI, myBillsAPI } from "../../../helpers/APIs/BillsAPIs";
import EmptySection from "../../others/EmptySection";
import Loading from "../../alerts/Loading";
import { useTranslation } from "react-i18next";
import TutorialsDialog from "../../dialogs/TutorialsDialog";
import EditBillVideo from "../../../assets/videos/editBill.mp4";



function BillsPage() {
  const { t } = useTranslation();

  const [myBillsArrowState, setMyBillsArrowState] = useState(true);
  const [archivedBillsArrowState, setArchivedBillsArrowState] = useState(false);
  const archivedBillsSection = useRef(null);
  const myBillsSection = useRef(null);
  const [refresh, setRefresh] = useState(false);

  const refreshUI = () => {
    setRefresh(!refresh);
  };

  const handleArchivedBills = () => {
    if (archivedBillsSection.current.classList.contains("hidden")) {
      setArchivedBillsArrowState(true);
    } else {
      setArchivedBillsArrowState(false);
    }
    archivedBillsSection.current.classList.toggle("hidden");
  };

  const handleMyBills = () => {
    if (myBillsSection.current.classList.contains("hidden")) {
      setMyBillsArrowState(true);
    } else {
      setMyBillsArrowState(false);
    }
    myBillsSection.current.classList.toggle("hidden");
  };

  const [myBills, setMyBills] = useState([]);
  const [archivedBills, setArchivedBills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeBills, setAtiveBills] = useState(0);

  useEffect(() => {
    const archivedAndMyBilllsRequest = async () => {
      setIsLoading(true);
      const myBillsResponse = await myBillsAPI();
      const archivedResponse = await archivedBillsAPI();

      if (myBillsResponse.success && archivedResponse.success) {
        setMyBills(myBillsResponse.data);
        setArchivedBills(archivedResponse.data);
        setIsLoading(false);
      } else {
        console.log("Something went wrong");
        setIsLoading(false);
      }
    };
    archivedAndMyBilllsRequest();
  }, [refresh]);

  const duration = 500;
  useEffect(() => {
    let start = 0;
    const increment = myBills?.length / (duration / 50);
    const timer = setInterval(() => {
      start += increment;
      if (start >= myBills?.length) {
        clearInterval(timer);
        setAtiveBills(myBills?.length);
      } else {
        setAtiveBills(Math.floor(start));
      }
    }, 50);
    return () => clearInterval(timer);
  }, [myBills]);

  return (
    <>
      <Header refresh={refreshUI} />

      <main className="absolute w-full h-[80%] text-[var(--gray)] overflow-y-auto overflow-x-hidden ">
        {isLoading && <Loading />}

        {/* My Active Bills */}
        <section className="mt-2 ">
          {/* Upper Div */}
          <div className="flex justify-between items-center">

            
            <div className="flex items-center ms-3">
              <TutorialsDialog video={EditBillVideo} style={"me-1 size-7 "} title={t("editBillDialog.tutorialTitle", "كيفية تعديل الفواتير")} description={t("editBillDialog.tutorial", "يمكنك تعديل الفواتير من خلال النقر على زر 'تعديل' وتحديث الخانات المطلوبة. ملاحظة: لا يمكن تعديل الفواتير التي تم دفعها أو تسويتها من قبل أحد الأعضاء.")} />
              
              <svg
                onClick={() => refreshUI()}
                className="size-6 text-yellow-200 mx-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              
            </div>

            <div className="flex content-center items-center me-3" onClick={handleMyBills}>
              
              {myBillsArrowState ? (
                <AiFillCaretDown className="bottom_arrow size-7 ms-1 text-[var(--yellow)]" />
              ) : (
                <AiFillCaretRight className="right_arrow size-7 ms-1 text-[var(--yellow)]" />
              )}
              <h2 className="text-lg mx-1">{t("myActiveBills")}</h2>
            </div>

          </div>

          {/* Bills */}
          <div ref={myBillsSection} className="px-2">
            {myBills?.length ? (
              myBills.map((bill) => <MyBillView refresh={refreshUI} key={bill.billId} bill={bill} />)
            ) : (
              <EmptySection
                title={t("emptyActiveTitle")}
                message={t("emptyActiveMessage")}
              />
            )}
          </div>
        </section>

        {/* Archived Bills */}
        <section className="my-8">
          {/* Upper Div */}
          <div className="flex justify-between items-center">
           
            <div className="flex items-center mx-3">
              <svg
                onClick={() => refreshUI()}
                className="size-6 text-yellow-200 me-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </div>
            
            <div className="flex content-center items-center text-end justify-end me-3" onClick={handleArchivedBills}>
             
              {archivedBillsArrowState ? (
                <AiFillCaretDown className="bottom_arrow size-7 ms-1 text-[var(--yellow)]"/>
              ) : (
                <AiFillCaretRight className="right_arrow size-7 ms-1 text-[var(--yellow)]" />
              )}

                <h2 className="text-lg mx-1 ">{t("archivedBills")}</h2>          
            </div>

           
          </div>

          {/* Bills */}
          <div ref={archivedBillsSection} className="px-2 hidden">
            {archivedBills?.length ? (
              archivedBills.map((bill, index) => <ArchivedBillView key={index} bill={bill} />)
            ) : (
              <EmptySection
                title={t("emptyArchivedTitle")}
                message={t("emptyArchivedMessage")}
              />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default BillsPage;
