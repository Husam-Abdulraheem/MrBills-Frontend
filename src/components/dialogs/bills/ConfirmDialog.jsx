import React from "react";
import { useTranslation } from "react-i18next";

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) {
  const { t } = useTranslation();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#171715] border border-gray-600 rounded-2xl shadow-lg p-6 w-full max-w-sm">
        <h3 className="text-xl font-semibold text-white mb-4 text-center">
          {title}
        </h3>
        <p className="text-gray-300 mb-6 text-center">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[var(--yellow)] text-[var(--dark)] rounded-full hover:opacity-90 focus:outline-none"
          >
            {t("yes")}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-600 text-gray-300 rounded-full hover:bg-gray-700 focus:outline-none"
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
