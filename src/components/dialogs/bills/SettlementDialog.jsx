import { useEffect, useRef, useState } from "react";
import SettlementBillView from "../../bills/SettlementBillView";
import { myBillsAPI, settleBillAPI } from "../../../helpers/APIs/BillsAPIs";
import EmptySection from "../../others/EmptySection";
import Loading from "../../alerts/Loading";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

// FixedOverlay creates its own container only once
function FixedOverlay({ children }) {
  const containerRef = useRef(document.createElement("div"));

  useEffect(() => {
    const container = containerRef.current;
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, []);

  return createPortal(children, containerRef.current);
}

function SattlementDialog(props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [myBills, setMyBills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredBills, setFilteredBills] = useState([]);
  const formRef = useRef(null);

  // Fetch bills when the dialog is opened
  useEffect(() => {
    if (!isOpen) return;

    const myBillsRequest = async () => {
      const response = await myBillsAPI();
      if (response.success) {
        setMyBills(response.data);
      }
    };

    myBillsRequest();
  }, [isOpen]);

  // Filter bills for settlement once bills are fetched
  useEffect(() => {
    const bills = myBills?.map((bill, index) => {
      // Filter claimants for the current bill owner
      const amount = bill.claimants?.filter(
        (claimant) => claimant.claimantName === props.billOwner
      );

      if (
        bill.claimants?.filter(
          (claimant) =>
            claimant.claimantName === props.billOwner &&
            claimant.amount > 0 &&
            claimant.isPaid === false
        ).length > 0
      ) {
        return (
          <SettlementBillView
            key={index}
            id={index}
            bill={bill}
            settlePrice={amount}
          />
        );
      } else {
        return null;
      }
    });

    // Filter out any null values
    setFilteredBills(bills.filter((bill) => bill !== null));
  }, [myBills, props.billOwner]);

  const settleBillRequest = async (form) => {
    form.preventDefault();
    setIsLoading(true);
    let choosenBill = null;
    // Loop through form elements to find the checked radio/checkbox
    for (let index = 0; index < form.target.length; index++) {
      if (form.target[index].checked) {
        choosenBill = form.target[index].id;
      }
    }

    if (choosenBill != null) {
      const response = await settleBillAPI(choosenBill, props.billId);
      if (response.success) {
        setIsLoading(false);
        setIsOpen(false);
        props.refresh && props.refresh();
      } else {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <div onClick={() => setIsOpen(true)} className="w-1/3 bg-[#555451] text-center rounded-l-lg">
        <button className="p-5 py-8  ">
          {t("settlementDialog.button", "Settlement")}
        </button>
      </div>
      <FixedOverlay>
        {isOpen && (
          <>
            {/* Transparent background */}
            <div
              onClick={() => setIsOpen(false)}
              className="fixed top-0 left-0 bg-black bg-opacity-80 w-full h-full content-center z-40 overflow-auto"
            ></div>
            {/* Dialog */}
            <div className="pop_up fixed max-h-[60%] overflow-scroll text-white items-center justify-center py-3 text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] border border-[var(--yellow)] rounded-2xl shadow-md z-50 bg-neutral-900 transition-all duration-300">
              {/* Title */}
              <div className="mb-7 mt-5">
                <h3 className="text-lg font-bold">
                  {t("settlementDialog.chooseBill", "Choose Bill")}
                </h3>
              </div>
              <form ref={formRef} onSubmit={settleBillRequest}>
                {filteredBills?.length > 0 ? (
                  filteredBills.map((bill) => bill)
                ) : (
                  <EmptySection
                    title={t(
                      "settlementDialog.emptyTitle",
                      "There is No Common Bills"
                    )}
                    message={t(
                      "settlementDialog.emptyMessage",
                      "There is no Common Bills Between You"
                    )}
                  />
                )}
                <div className="sticky bottom-2 left-0 right-0 z-50 mt-10 mb-3">
                  <input
                    type="submit"
                    className="bg-[var(--yellow)] text-[var(--dark)] py-1 px-4 rounded-xl"
                    value={t("settlementDialog.submit", "Settle it")}
                  />
                </div>
              </form>
            </div>
          </>
        )}
      </FixedOverlay>
    </>
  );
}

export default SattlementDialog;
