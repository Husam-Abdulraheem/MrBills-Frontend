import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { useTranslation } from "react-i18next";
import getGroupAPI from "../../helpers/APIs/GroupAPIs";
import slide1 from "../../assets/app_Images/first.svg";
import slide2 from "../../assets/app_Images/team.svg";
import slide3 from "../../assets/app_Images/deal.svg";

import appLogo from "../../assets/app_Images/Mr Bills Application.png";

const slides = [
  {
    id: 1,
    image: slide1,
    title: "Make Your Own Group!",
    description:
      "add your friends and share your bills easily to organize shared expenses",
  },
  {
    id: 2,
    image: slide2,
    title: "Add Your Bill Easily!",
    description:
      "Upload Bill Image, Enter Details, and Share with Your Group Immediately!",
  },
  {
    id: 3,
    image: slide3,
    title: "Smart Bill Settlement!",
    description:
      "Reduce Bank Transfers With Smart Clearing System, Save Time and Effort.",
  },
];

function Introduction() {
  const { t, i18n } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const length = slides.length;
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const dropdownMenuRef = useRef(null);
  const [dropdownAlignLeft, setDropdownAlignLeft] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setIsOpen(false);
  };

  const isRtl = i18n.language === "ar";
  // Auto slide interval (fixed delay for all slides)
  useEffect(() => {
    if (current < length - 1) {
      const timeout = setTimeout(() => {
        setCurrent((prev) => (prev < length - 1 ? prev + 1 : prev));
        setProgress(0);
      }, 5000); // 8 seconds for each slide
      return () => clearTimeout(timeout);
    }
  }, [current, length]);

  // Progress bar for each slide (fixed duration)
  useEffect(() => {
    setProgress(0);
    let start = Date.now();
    let animationFrame;
    function updateProgress() {
      const elapsed = Date.now() - start;
      const percent = Math.min((elapsed / 5000) * 100, 100);
      setProgress(percent);
      if (percent < 100) {
        animationFrame = requestAnimationFrame(updateProgress);
      }
    }
    updateProgress();
    return () => cancelAnimationFrame(animationFrame);
  }, [current]);

  const handleNavigate = () => {
    navigate("/register");
  };

  const nextSlide = () => {
    if (current < length - 1) {
      setCurrent(current + 1);
      setProgress(0);
    }
  };

  const prevSlide = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setProgress(0);
    }
  };

  const goToSlide = (index) => {
    setCurrent(index);
    setProgress(0);
  };

  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    delta: 5,
  });

  // Check group API for redirection if the user is already logged in
  useEffect(() => {
    const getGroupRequest = async () => {
      try {
        if (localStorage.getItem("token")) {
          const response = await getGroupAPI();
          if (response?.data) {
            navigate("/main");
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    getGroupRequest();
  }, [navigate]);

  useEffect(() => {
    if (isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      // If the dropdown would overflow the right edge, align left
      if (rect.right + 200 > window.innerWidth) {
        setDropdownAlignLeft(true);
      } else {
        setDropdownAlignLeft(false);
      }
    }
  }, [isOpen]);

  useLayoutEffect(() => {
    if (isOpen && dropdownMenuRef.current && ref.current) {
      const menuRect = dropdownMenuRef.current.getBoundingClientRect();
      const buttonRect = ref.current.getBoundingClientRect();
      let style = { minWidth: "6rem", maxWidth: "calc(100vw - 16px)" };
      // If dropdown overflows right, align left
      if (menuRect.right > window.innerWidth) {
        style.right = "auto";
        style.left = "0";
        style.transform = "none";
      } else if (menuRect.left < 0) {
        style.left = "auto";
        style.right = "0";
        style.transform = "none";
      } else {
        style.right = "0";
        style.left = "auto";
        style.transform = "none";
      }
      setDropdownStyle(style);
    }
  }, [isOpen]);

  return (
    <div
      {...handlers}
      className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-[#1a1a1a] to-black"
    >
      {/* شعار التطبيق في الزاوية اليسرى العليا */}
      <div className="absolute top-6 left-6 z-50 flex items-center">
        <img src={appLogo} alt="App Logo" className="h-10 mr-2" />
        <h1 className="text-2xl font-bold text-[var(--yellow)]">
          {t("introduction.appName")}
        </h1>
      </div>

      {/* Language Dropdown Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <div ref={ref} className="relative inline-block">
          <button
            onClick={() => setIsOpen((o) => !o)}
            className="relative z-10 p-2 bg-transparent border-none rounded-md focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 text-[var(--yellow)]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
              />
            </svg>
          </button>
          {isOpen && (
            <div
              ref={dropdownMenuRef}
              style={dropdownStyle}
              className="absolute mt-2 text-center bg-neutral-900 text-[var(--gray)] rounded-md shadow-none z-20"
              role="menu"
            >
              <button
                onClick={() => changeLang("en")}
                className="block w-full text-center px-4 py-2 text-base capitalize font-bold hover:underline bg-transparent"
                role="menuitem"
              >
                EN
              </button>
              <button
                onClick={() => changeLang("ar")}
                className="block w-full text-center px-4 py-2 text-base capitalize font-bold hover:underline bg-transparent"
                role="menuitem"
              >
                AR
              </button>
              <button
                onClick={() => changeLang("tr")}
                className="block w-full text-center px-4 py-2 text-base capitalize font-bold hover:underline bg-transparent"
                role="menuitem"
              >
                TR
              </button>
            </div>
          )}
        </div>
      </div>

      {/* شريط التقدم */}
      <div className="absolute top-0 left-0 w-full h-1 z-40">
        <div
          className="h-full bg-[var(--yellow)] transition-all duration-300 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div
        className={`${
          isRtl ? "flex-row-reverse" : "flex-row"
        } flex h-full transition-transform duration-1000 ease-out`}
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="w-full h-full flex flex-col justify-center items-center flex-shrink-0 relative px-4"
          >
            <div className="flex flex-col items-center justify-center h-full max-w-4xl">
              <img
                src={slide.image}
                alt=""
                className="size-56 md:size-72 mt-8 md:mt-12 mb-6"
              />

              <div className="text-center mb-8">
                <h2 className="text-[var(--yellow)] text-3xl md:text-5xl font-bold mb-4">
                  {t(`introduction.slide${slide.id}.title`)}
                </h2>
                <p className="text-[var(--gray)] text-lg md:text-xl mb-6 max-w-2xl mx-auto">
                  {t(`introduction.slide${slide.id}.description`)}
                </p>
              </div>

              {slide.id === 3 && (
                <div className="flex flex-col items-center">
                  <button
                    onClick={handleNavigate}
                    className="mt-4 bg-[var(--yellow)] text-[var(--dark)] px-10 py-3 rounded-full font-bold text-lg hover:bg-yellow-500 transition-colors shadow-lg"
                  >
                    {t("introduction.slide3.buttonText")}
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="mt-4 text-[var(--yellow)] bg-transparent px-6 py-2 font-medium hover:underline"
                  >
                    {t("introduction.loginText")}
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem("token", "mock-jwt-token-demo");
                      navigate("/main");
                    }}
                    className="mt-2 text-xs md:text-sm text-gray-400 bg-gray-800/80 px-4 py-1.5 rounded-full border border-yellow-500/30 hover:text-yellow-400 transition-all"
                  >
                    {t("demo.oneClickDemo", "⚡ تجربة النسخة الحية فوراً (Demo)")}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        disabled={current === 0}
        className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-4 rounded-full focus:outline-none transition-all ${
          current === 0 ? "opacity-0 cursor-default" : "opacity-100"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        disabled={current === length - 1}
        className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-4 rounded-full focus:outline-none transition-all ${
          current === length - 1 ? "opacity-0 cursor-default" : "opacity-100"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 transition-all duration-300 ease-in-out rounded-full focus:outline-none ${
              current === index ? "bg-[var(--yellow)] h-3 w-8" : "bg-gray-500"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default Introduction;
