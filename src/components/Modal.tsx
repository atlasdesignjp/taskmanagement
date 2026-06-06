'use client';

import { ReactNode, useEffect } from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // モーダルが開いている間、背景のスクロールをロックしてスクロール位置を保持する
  useEffect(() => {
    const mainEl = document.querySelector('main') as HTMLElement | null;
    if (!mainEl) return;
    const savedScroll = mainEl.scrollTop;
    mainEl.style.overflow = 'hidden';
    return () => {
      mainEl.style.overflow = '';
      mainEl.scrollTop = savedScroll;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/50"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-t-2xl shadow-xl w-full overflow-y-auto max-h-[85vh]">
        <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto mt-3" />
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-800">{title}</h2>
          <button onClick={onClose} className="text-slate-400 text-xl leading-none">
            ✕
          </button>
        </div>
        <div className="px-5 py-5 pb-8">{children}</div>
      </div>
    </div>
  );
}
