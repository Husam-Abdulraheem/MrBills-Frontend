import React, { useState, useRef, useLayoutEffect } from 'react';

const Tooltip = ({ children, message }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, transform: '', arrowLeft: '50%' });
  const wrapperRef = useRef(null);
  const tooltipRef = useRef(null);

  function handle() {
    setIsOpen(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 4000);
  }

  useLayoutEffect(() => {
    if (isOpen && wrapperRef.current && tooltipRef.current) {
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      let top = -tooltipRect.height - 8;
      let left = (wrapperRect.width - tooltipRect.width) / 2;
      let transform = '';
      let arrowLeft = '50%';

      // Flip below if not enough space above
      if (wrapperRect.top < tooltipRect.height + 16) {
        top = wrapperRect.height + 8;
        transform = 'translateY(0)';
      }
      // Prevent left overflow
      if (wrapperRect.left + left < 8) {
        left = 8 - wrapperRect.left;
        arrowLeft = `${Math.max(wrapperRect.width / 2, 16)}px`;
      }
      // Prevent right overflow
      if (wrapperRect.left + left + tooltipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - 8 - wrapperRect.left - tooltipRect.width;
        arrowLeft = `${tooltipRect.width / 2}px`;
      }
      setPosition({ top, left, transform, arrowLeft });
    }
  }, [isOpen]);

  return (
    <div ref={wrapperRef} onClick={handle} className="relative inline-block w-auto">
      {children}
      {isOpen && (
        <div
          ref={tooltipRef}
          style={{
            top: position.top,
            left: position.left,
            transform: position.transform,
            minWidth: '120px',
            maxWidth: '220px',
            wordBreak: 'break-word',
            zIndex: 9999,
          }}
          className="absolute p-2 text-sm text-gray-800 bg-[var(--gray)] rounded-lg shadow-lg dark:shadow-none transition-all duration-200"
        >
          <span className="block break-words whitespace-pre-line">{message}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 absolute"
            style={{
              left: position.arrowLeft,
              bottom: position.top > 0 ? 'auto' : '-12px',
              top: position.top > 0 ? '-12px' : 'auto',
              transform: 'translateX(-50%) rotate(45deg)',
              color: 'var(--gray)',
            }}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <rect width="24" height="24" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
