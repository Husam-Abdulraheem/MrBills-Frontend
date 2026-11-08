import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function SupportButton() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const menuRef = useRef(null);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleWhatsApp = () => {
    const url = "https://wa.me/905347471218";
    if (window.cordova && window.cordova.InAppBrowser) {
      window.cordova.InAppBrowser.open(url, "_system");
    } else {
      window.open(url, "_blank");
    }
    setOpen(false);
  };

  const handleEmail = () => {
    const mailto = "mailto:mr.bills.original@gmail.com?subject=استفسار الدعم";
    if (window.cordova && window.cordova.InAppBrowser) {
      window.cordova.InAppBrowser.open(mailto, "_system");
    } else {
      window.location.href = mailto;
    }
    setOpen(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-20 right-6 z-50 select-none transition-opacity duration-300 opacity-40 hover:opacity-100"
      ref={menuRef}
    >
      {/* القائمة المنبثقة */}
      {open && (
        <div
          className="absolute bottom-16 right-0 mb-2 flex flex-col bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden w-48 animate-fade-in-up"
          style={{ animationDuration: "0.3s" }}
        >
          <button
            onClick={handleWhatsApp}
            className="flex items-center px-4 py-3 text-right hover:bg-yellow-50 transition-all duration-200 group"
          >
            <span className="ml-2 text-yellow-600 text-lg">
              <svg
                class="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  d="M12 4a8 8 0 0 0-6.895 12.06l.569.718-.697 2.359 2.32-.648.379.243A8 8 0 1 0 12 4ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.96 9.96 0 0 1-5.016-1.347l-4.948 1.382 1.426-4.829-.006-.007-.033-.055A9.958 9.958 0 0 1 2 12Z"
                  clip-rule="evenodd"
                />
                <path
                  fill="currentColor"
                  d="M16.735 13.492c-.038-.018-1.497-.736-1.756-.83a1.008 1.008 0 0 0-.34-.075c-.196 0-.362.098-.49.291-.146.217-.587.732-.723.886-.018.02-.042.045-.057.045-.013 0-.239-.093-.307-.123-1.564-.68-2.751-2.313-2.914-2.589-.023-.04-.024-.057-.024-.057.005-.021.058-.074.085-.101.08-.079.166-.182.249-.283l.117-.14c.121-.14.175-.25.237-.375l.033-.066a.68.68 0 0 0-.02-.64c-.034-.069-.65-1.555-.715-1.711-.158-.377-.366-.552-.655-.552-.027 0 0 0-.112.005-.137.005-.883.104-1.213.311-.35.22-.94.924-.94 2.16 0 1.112.705 2.162 1.008 2.561l.041.06c1.161 1.695 2.608 2.951 4.074 3.537 1.412.564 2.081.63 2.461.63.16 0 .288-.013.4-.024l.072-.007c.488-.043 1.56-.599 1.804-1.276.192-.534.243-1.117.115-1.329-.088-.144-.239-.216-.43-.308Z"
                />
              </svg>
            </span>
            <span className="flex-1 text-gray-800 font-medium">واتساب</span>
            <span className="text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              →
            </span>
          </button>
          <button
            onClick={handleEmail}
            className="flex items-center px-4 py-3 text-right hover:bg-yellow-50 transition-all duration-200 group border-t border-gray-100"
          >
            <span className="ml-2 text-yellow-600 text-lg">
              <svg
                class="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M2.038 5.61A2.01 2.01 0 0 0 2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6c0-.12-.01-.238-.03-.352l-.866.65-7.89 6.032a2 2 0 0 1-2.429 0L2.884 6.288l-.846-.677Z" />
                <path d="M20.677 4.117A1.996 1.996 0 0 0 20 4H4c-.225 0-.44.037-.642.105l.758.607L12 10.742 19.9 4.7l.777-.583Z" />
              </svg>
            </span>
            <span className="flex-1 text-gray-800 font-medium">
              البريد الإلكتروني
            </span>
            <span className="text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              →
            </span>
          </button>
        </div>
      )}

      {/* الزر الرئيسي مع تأثيرات محسنة */}
      <button
        onClick={() => setOpen(!open)}
        className={`bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl select-none transition-all duration-300 flex items-center justify-center ${
          open ? "rotate-90" : "rotate-0"
        }`}
        style={{ width: "50px", height: "50px" }}
        title="تواصل مع الدعم"
        aria-label="فتح قنوات الدعم"
      >
        {open ? (
          <span className="text-xl transition-transform duration-300">✕</span>
        ) : (
          <span className="text-xl transition-transform duration-300">
            <svg
              class="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M12 2a7 7 0 0 0-7 7 3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h1a1 1 0 0 0 1-1V9a5 5 0 1 1 10 0v7.083A2.919 2.919 0 0 1 14.083 19H14a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1a2 2 0 0 0 1.732-1h.351a4.917 4.917 0 0 0 4.83-4H19a3 3 0 0 0 3-3v-2a3 3 0 0 0-3-3 7 7 0 0 0-7-7Zm1.45 3.275a4 4 0 0 0-4.352.976 1 1 0 0 0 1.452 1.376 2.001 2.001 0 0 1 2.836-.067 1 1 0 1 0 1.386-1.442 4 4 0 0 0-1.321-.843Z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        )}
      </button>
    </div>
  );
}
