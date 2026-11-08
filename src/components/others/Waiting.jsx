import React from 'react';
import { useTranslation } from 'react-i18next';

function Waiting() {
  const { t } = useTranslation();

  return (
    <main
      id="main"
      className="absolute top-0 w-full h-full bg-[#171715] text-[var(--gray)] overflow-y-auto overflow-x-hidden flex items-center content-center"
    >
      <div className="w-full text-center">
        <h1 className="text-2xl bg-golden bg-clip-text text-transparent">
          {t("groupSubscriptionEnded")}
        </h1>
        <p className="text-sm text-[var(--gray)] mt-2">
          {t("waitUntilGroupOwnerResubscribe")}
        </p>
      </div>
    </main>
  );
}

export default Waiting;
