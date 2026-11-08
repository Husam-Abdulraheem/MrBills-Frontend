import {  useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import SettlementDialog from "../dialogs/bills/SettlementDialog";
import PayBillDialog from '../dialogs/bills/PayBillDialog';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function BillView(props) {
  const { t } = useTranslation();
  // State to control swipe direction
  const [swiped, setSwiped] = useState(false);

  // Configure swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => setSwiped(true),
    onSwipedRight: () => setSwiped(false),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true, // allows swipe with mouse on desktop
  });

  const [copied , setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(props.bill.iban)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      })
      .catch(err => console.error("Failed to copy text:", err));
  };


  

  return (
    <div {...handlers} className="relative h-auto w-auto mx-2 my-5">
      {/* Frontside Card */}
      <div
        className={`bg-[#2e2e2e] px-6 py-3 rounded-xl text-[#ededed] transition-transform duration-300 ${
          swiped ? "transform -translate-x-96 " : ""
        }`}
      >
        {/* Upper Part */}
        <div className="flex justify-between overflow-hidden">
          <p className="self-center opacity-60 text-[10px]">
            {props.bill.date.split("T")[0]}
          </p>
          <h2 className="text-lg text-end font-bold w-[80%] overflow-hidden">
            {props.bill.description}
          </h2>
       
        </div>

        {/* Middle Part */}
        <div className="flex justify-between overflow-hidden">
         
          <p className="self-center text-[16px] font-bold">
            {props.bill.amount} ₺
          </p>
          <p className="opacity-60 text-[12px] mt-1">{props.bill.billOwner}</p>
          
        </div>

        {/* Lower Part */}
        <div className="flex items-center justify-end mt-2 ">
         
          <p onClick={handleCopy} className="opacity-60 text-xs">
            {t("billView.copyIban", "Copy IBAN")}
          </p>
          {copied ?  
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 ms-2 self-center">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg> : 
            <svg 
              onClick={handleCopy}
              className="size-5 ms-2 self-center "
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"
                />
              </svg>

        }
        </div>
      </div>

      {/* Backside Card */}
      <div
        className={`absolute top-0 left-0 w-full h-full bg-[#2e2e2e] rounded-xl text-[#ededed] transition-transform duration-300 ${
          swiped ? "transform translate-x-0  " : "transform translate-x-full mx-5"
        }`}
      >
        <div className="flex justify-between items-center h-full">
          <SettlementDialog
            billOwner={props.bill.billOwner}
            billId={props.bill.billId}
            refresh={props?.refresh}
          />
          <div className="w-1/3 text-center flex justify-center">
            {props?.bill?.invoice != null && (
              <Link to={props?.bill?.invoice} className="bg-golden p-2 rounded-full">
                <svg
                  className="size-10 text-[var(--dark)]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v7.5m2.25-6.466a9.016 9.016 0 0 0-3.461-.203c-.536.072-.974.478-1.021 1.017a4.559 4.559 0 0 0-.018.402c0 .464.336.844.775.994l2.95 1.012c.44.15.775.53.775.994 0 .136-.006.27-.018.402-.047.539-.485.945-1.021 1.017a9.077 9.077 0 0 1-3.461-.203M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
              </Link>
            )}
          </div>
          <PayBillDialog
            id={props.bill.billId}
            isRequired={props.bill.isRequired}
            refresh={props?.refresh}
          />
        </div>
      </div>
    </div>
  );
}

export default BillView;
