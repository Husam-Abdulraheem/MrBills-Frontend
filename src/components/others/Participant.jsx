import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Participant(props) {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex items-center gap-4 py-1 w-full flex-row">
      {/* Status & Receipt (right in so, id, en, tr; left in ar) */}
      <div className={`flex items-center gap-2 w-fit ${i18n.language === 'ar' ? 'order-1 ml-auto' : 'order-2 mr-0 ml-auto'}`}
        style={{ minWidth: 'fit-content' }}>
        {!props.archived ? (
          props?.claimant?.isPaid ? (
            <span className="bg-[var(--yellow)] text-[var(--dark)] rounded-full px-6 py-1 text-xs font-semibold shadow">{t("paid")}</span>
          ) : (
            <span className="border-2 border-[var(--yellow)] text-[var(--gray)] rounded-full px-4 py-1 text-xs font-semibold">{t("pending")}</span>
          )
        ) : null}
        {props?.receipt && (
          <Link to={props?.receipt} title={t('payBillDialog.uploadTitle')}>
            <svg
              className="size-6 animate-bounce text-[var(--yellow)]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 1.5H5.625c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5Zm6.61 10.936a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 14.47a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                clipRule="evenodd"
              />
              <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
            </svg>
          </Link>
        )}
      </div>
      {/* Participant Name & Amount (left in so, id, en, tr; right in ar) */}
      <div className={`flex flex-col min-w-0 flex-1 ${i18n.language === 'ar' ? 'order-2 items-end text-right' : 'order-1 items-start text-left'}`}>
        <span className="text-xs font-bold text-white truncate max-w-full">{props?.claimant?.claimantName}</span>
        <span className="text-xs text-[var(--yellow)] font-semibold">{props?.claimant?.amount} ₺</span>
      </div>
    </div>
  );
}

export default Participant;
