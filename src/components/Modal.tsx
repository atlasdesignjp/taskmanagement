'use client';

import { ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ title, onClose, children }: ModalProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    const mainEl = document.querySelector('main') as HTMLElement | null;
    if (!mainEl) return;

    const savedScroll = mainEl.scrollTop;
    mainEl.style.overflow = 'hidden';

    // iOS は overflow:hidden が効かないため touchmove を直接ブロックする
    const preventScroll = (e: TouchEvent) => {
      if (sheetRef.current?.contains(e.target as Node)) return;
      e.preventDefault();
    };
    mainEl.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      mainEl.removeEventListener('touchmove', preventScroll);
      mainEl.style.overflow = '';
      mainEl.scrollTop = savedScroll;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/50"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={sheetRef}
        className="bg-white rounded-t-2xl shadow-xl w-full overflow-y-auto min-h-[70vh] max-h-[92vh]"
      >
        <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto mt-3" />
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-800">{title}</h2>
          <button onClick={onClose} className="text-slate-400 text-xl leading-none">✕</button>
        </div>
        <div className="px-5 py-5 pb-10">{children}</div>
      </div>
    </div>
  );
}
