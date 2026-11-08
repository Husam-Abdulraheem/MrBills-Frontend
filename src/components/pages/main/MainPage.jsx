import Footer from "../../layout/Footer";
import Header from "../../layout/Header";

import TotalDebts from "../../../assets/icons/total_debts.png";
import Receivables from "../../../assets/icons/receivables.png";
import BillView from "../../bills/BillView";

import FilterDialog from "../../dialogs/main/FilterDialog";

import { useState, useEffect } from "react";
import { getBillsAPI } from "../../../helpers/APIs/BillsAPIs";
import EmptySection from "../../others/EmptySection";
import Loading from "../../alerts/Loading";
import { useTranslation } from "react-i18next";
import TutorialsDialog from "../../dialogs/TutorialsDialog";
import PayBillVideo from "../../../assets/videos/payBill.mp4";

function MainPage() {
  const { t } = useTranslation();

  const [listIsOpen, setListIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [bills, setBills] = useState([]);
  const [allBills, setAllBills] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [statics, setStatics] = useState({
    current_debts: 0,
    current_receivables: 0,
  });
  const [debts, setDebts] = useState(0);
  const [receivables, setReceivables] = useState(0);

  const refreshUI = () => {
    setRefresh(!refresh);
  };

  const duration = 1500;

  useEffect(() => {
    let start = 0;
    const increment = statics.current_debts / (duration / 50);
    const timer = setInterval(() => {
      start += increment;
      if (start >= statics.current_debts) {
        clearInterval(timer);
        setDebts(statics.current_debts);
      } else {
        setDebts(Math.floor(start));
      }
    }, 50);
    return () => clearInterval(timer);
  }, [statics]);

  useEffect(() => {
    let start = 0;
    const increment = statics.current_receivables / (duration / 50);
    const timer = setInterval(() => {
      start += increment;
      if (start >= statics.current_receivables) {
        clearInterval(timer);
        setReceivables(statics.current_receivables);
      } else {
        setReceivables(Math.floor(start));
      }
    }, 50);
    return () => clearInterval(timer);
  }, [statics]);

  useEffect(() => {
    const getBills = async () => {
      setIsLoading(true);
      const response = await getBillsAPI();
      if (response.success) {
        // Success Handling
        setBills(response.data?.bills);
        setAllBills(response.data?.bills);
        setIsFiltered(false);
        setStatics({
          current_debts: response.data.totalDebtsAmount,
          current_receivables: response.data.receivables,
        });
        setIsLoading(false);
      } else {
        // Error Handling
        setIsLoading(false);
      }
    };
    getBills();
  }, [refresh]);

  function filter(member) {
    if (allBills?.length > 0) {
      setBills(allBills?.filter((bill) => bill.billOwner === member));
      setListIsOpen(false);
      setIsFiltered(true);
    }
  }

  function restFilter() {
    setBills(allBills);
    setIsFiltered(false);
  }

 
  const [show , setShow] = useState(true);
  useEffect(() =>{
    setTimeout(() => {
      setShow(false);
    }
    , 5000)
  },[])
  return (
    <>
      <Header />

      {isLoading && <Loading />}
      {/* Content of The Page */}

    

      <main

        id="main"
        className="absolute w-full h-[80%]  text-[var(--gray)] overflow-y-auto overflow-x-hidden max-w-full"
      >
        {/* Statics Section */}
        <section className="w-full flex flex-col justify-center gap-5 overflow-x-auto">
          <div className="w-full flex flex-row justify-between gap-4 items-stretch min-w-[320px]">

            {/* Debts Card */}
            <div className="flex-1 
                    backdrop-blur-xl rounded-3xl p-5 shadow-xl 
                    transition-transform duration-300
                    flex flex-col justify-center min-h-[110px] overflow-x-auto">
              <div className="flex items-center min-w-auto gap-2">
                <div className="p-2 bg-red-500 bg-opacity-20 rounded-2xl flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  <img
                    src={TotalDebts}
                    className="max-w-full max-h-full"
                    alt={t("mainPage.totalDebtsAlt", "Total Debts Icon")}
                  />
                </div>
                <div className="ml-4 flex-grow min-w-0">
                  <h3 className="text-sm sm:text-base font-medium text-gray-300 tracking-wide">
                    {t("mainPage.debts", "Debts")}
                  </h3>
                  <p className="mt-1 text-xl sm:text-2xl font-bold text-red-500 break-words">
                    {statics.current_debts} ₺
                  </p>

                </div>
              </div>
            </div>

            {/* Receivables Card */}
            <div className="flex-1 
                    backdrop-blur-xl rounded-3xl p-5 shadow-xl 
                    transition-transform duration-300
                    flex flex-col justify-center min-h-[110px] overflow-x-auto">
              <div className="flex items-center min-w-auto gap-2">
                <div className="p-2 bg-green-500 bg-opacity-20 rounded-2xl flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  <img
                    src={Receivables}
                    className="max-w-full max-h-full"
                    alt={t("mainPage.receivablesAlt", "Receivables Icon")}
                  />
                </div>
                <div className="ml-4 flex-grow min-w-0">
                  <h3 className="text-sm sm:text-base font-medium text-gray-300 tracking-wide">
                    {t("mainPage.receivables", "Receivables")}
                  </h3>
                  <p className="mt-1 text-xl sm:text-2xl font-bold text-green-500 break-words">
                    {statics.current_receivables} ₺
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Filter & Question Mark Section */}

        <section className="w-full flex p-2 h-[10%] justify-between mt-2 items-center" >
          <div className="flex items-center justify-start" >
            <TutorialsDialog video={PayBillVideo} style={"me-1 size-8 "} title={t("mainPage.payBillTutorialTitle", "كيفية دفع الفاتورة")} description={t("mainPage.paymentInstruction", "يمكنك إتمام عملية الدفع من خلال السحب إلى اليسار والضغط على زر 'الدفع' أو 'التسوية'، في حال وجود فواتير مشتركة.")} />
            {isFiltered ? (
              <svg
                onClick={restFilter}
                className="size-7 text-red-500 me-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            ) : (
              <svg
                onClick={() => refreshUI()}
                className="size-7 text-yellow-200 me-1"
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
            )}
          </div>
          <div className="flex flex-row-reverse items-center">
            {/* Reversed order: The heading appears on the right and the icons on the left */}
            <h3 id="bills" className="text-2xl font-bold mx-2">
              {t("mainPage.billsTitle", "Bills")}
            </h3>

            <div className="relative">

              <svg onClick={() => setListIsOpen(true)} className="size-7 text-[var(--yellow)] z-10 me-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" width="24" height="24" fill="currentColor">
                <path d="M1595 295q17 41-14 70l-493 493v742q0 42-39 59-13 5-25 5-27 0-45-19l-256-256q-19-19-19-45v-486l-493-493q-31-29-14-70 17-39 59-39h1280q42 0 59 39z" />
              </svg>
              
              {show && (
                <svg onClick={() => setListIsOpen(true)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 z-0 opacity-50 animate-ping   absolute top-0 right-0 left-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z" />
                </svg>
              )}



            </div>


            <FilterDialog
              isOpen={listIsOpen}
              setListIsOpen={setListIsOpen}
              filter={filter}

            />

          </div>
        </section>

        {/* Bills Section */}

        <section   >
          {bills?.length ? (
            bills?.map((bill, index) => (

              <BillView key={bill.billId} bill={bill} refresh={refreshUI} />
            ))
          ) : (
            <EmptySection
              title={t("mainPage.emptyTitle", "There is no Bills")}
              message={t(
                "mainPage.emptyMessage",
                "No One has Added You to Their Bills"
              )}
            />
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default MainPage;
