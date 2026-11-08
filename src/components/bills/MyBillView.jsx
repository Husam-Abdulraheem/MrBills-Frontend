import { useState } from "react";
import HistoryDialog from "../dialogs/bills/HistoryDialog";
import EditBillDialog from "../dialogs/main/EditBillDialog";
import Participant from "../others/Participant";
import { deleteBillAPI } from "../../helpers/APIs/BillsAPIs";
import Loading from "../alerts/Loading";
import { useTranslation } from "react-i18next";
import { FaShareAlt as ShareIcon } from "react-icons/fa";

function MyBillView(props) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCopiedDialog, setShowCopiedDialog] = useState(false);

  const deleteBillRequest = async () => {
    setIsLoading(true);
    const response = await deleteBillAPI(props.bill.billId);
    setIsLoading(false);
    if (response.success) {
      props?.refresh();
      setShowConfirm(false);
    }
  };

  const shareBill = () => {
    const bill = props.bill;
    const participantsText = (bill.claimants || [])
      .map((c) => `${c.claimantName || t("participant")}: ${c.amount || 0} ₺`)
      .join(", ");

    const messages = [
      t("shareTemplates.template1", {
        description: bill.description,
        participants: participantsText,
      }),
      t("shareTemplates.template2", {
        description: bill.description,
        participants: participantsText,
      }),
      t("shareTemplates.template3", {
        description: bill.description,
        participants: participantsText,
      }),
      t("shareTemplates.template4", {
        description: bill.description,
        participants: participantsText,
      }),
      t("shareTemplates.template5", {
        description: bill.description,
        participants: participantsText,
      }),
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    const billText = `
${randomMessage}

📅 ${t("billDate")}: ${(bill.createDate || bill.date || "").split("T")[0]}

✅ ${t("openBill")}:

💻 ${t("webLink")}

${t("shareEnjoy")}
`;

    if (navigator.share) {
      navigator
        .share({
          title: `💛 ${t("billTitle")}: ${bill.description}`,
          text: billText,
        })
        .catch((err) => console.log("Share canceled:", err));
    } else {
      navigator.clipboard.writeText(billText);
      setShowCopiedDialog(true);
    }
  };

  return (
    <div className="w-full bg-[var(--darkBlue)] rounded-2xl py-4 px-6 my-4 shadow-lg border border-[var(--yellow)] transition-all duration-200 hover:scale-[1.01] hover:shadow-2xl relative">
      {/* Dialog: Copied to Clipboard */}
      {showCopiedDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[var(--darkBlue)] p-6 rounded-xl shadow-xl w-80 text-center">
            <h2 className="text-xl font-bold mb-4">{t("copiedToClipboard")}</h2>
            <button
              onClick={() => setShowCopiedDialog(false)}
              className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg font-bold text-white transition mt-4"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {isLoading && <Loading />}

      {/* Upper Part */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-col items-start w-1/4 gap-1">
          <span className="text-xs text-gray-400 font-semibold">
            {t("total")}
          </span>
          <span className="text-xl font-extrabold text-[var(--yellow)] truncate max-w-full">
            {props.bill.total} ₺
          </span>
        </div>
        <div className="flex flex-col items-end w-3/4 gap-1">
          <span className="text-xs text-gray-400 font-semibold">
            {t("description")}
          </span>
          <span className="text-lg font-bold text-white truncate">
            {props.bill.description}
          </span>
        </div>
      </div>

      <hr className="bg-white w-full my-2 opacity-30" />

      {/* Participants */}
      <div className="w-full flex flex-col gap-2 mt-2">
        {props?.bill?.claimants?.map((claimant, index) => (
          <div
            key={index}
            className="bg-[var(--lightDark)] px-1 py-1 border-b-[1px] border-opacity-5 border-[var(--gray)] shadow-sm w-full"
          >
            <Participant state={true} claimant={claimant} />
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <HistoryDialog log={props.bill.activityLogs} />
          <span>{(props.bill.createDate || props.bill.date || "").split("T")[0]}</span>
        </div>

        <div className="flex gap-2">
          {/* زر تعديل */}
          <button
            className="hover:bg-[var(--yellow)] bg-[var(--lightDark)] p-2 me-2 rounded-full transition-colors shadow-md flex items-center justify-center"
            title={t("editBill")}
          >
            <EditBillDialog
              bill={props?.bill}
              refresh={props?.refresh}
              iconOnly
            />
          </button>
          {/* زر المشاركة */}
          <button
            onClick={shareBill}
            className="bg-blue-600 hover:bg-blue-700 transition-colors p-2 me-2 rounded-full flex items-center justify-center shadow-md"
            title={t("shareAsText")}
          >
            <ShareIcon className="size-5 text-white" />
          </button>

          {/* زر حذف */}
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-red-600 hover:bg-red-700 transition-colors p-2 rounded-full flex items-center justify-center shadow-md"
            title={t("deleteBill")}
          >
            <svg
              className="size-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Dialog تأكيد الحذف */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[var(--darkBlue)] p-6 rounded-xl shadow-xl w-80 text-center">
            <h2 className="text-xl font-bold mb-4">
              {t("confirmDeleteTitle")}
            </h2>
            <p className="mb-6">{t("confirmDeleteMessage")}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={deleteBillRequest}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold text-white transition"
              >
                {t("yes")}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-bold text-white transition"
              >
                {t("no")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBillView;
