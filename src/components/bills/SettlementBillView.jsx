import { useTranslation } from "react-i18next";

function SettlementBillView(props) {
  const { t } = useTranslation();

  return (
    <div className="reversed_flip w-auto bg-[#2e2e2e] mx-2 my-3 px-6 py-3 rounded-xl text-[#ededed]">
      <label htmlFor={props.bill.billId} className="bg-red-500">
        {/* Upper Part */}
        <div className="flex justify-between">
            <p className="self-center opacity-60 text-[10px]">
            {(props.bill.createDate || props.bill.date || "").split("T")[0]}
            </p>
          <h2 className="text-lg font-bold">{props.bill.description}</h2>
        
        </div>

        {/* Middle Part */}
        <div className="flex justify-between">
            <p className="self-center text-[16px] font-bold">
                {props.settlePrice?.[0]?.amount || props.bill?.amount || 0}
                {t("settlement.currency", "₺")}
            </p>
          <p className="text-[#ededed] opacity-60 text-[12px]">{props.bill.ownerName}</p>
          
        </div>

        {/* Lower Part */}
        <div className="flex justify-center me-2 mt-2 ">
          <input
            className="w-6 h-4 accent-gray-400"
            type="radio"
            name="bill"
            id={props.bill.billId}
          />
        </div>
      </label>
    </div>
  );
}

export default SettlementBillView;
