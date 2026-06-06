import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'タスク管理',
  description: 'シンプルなタスク管理アプリ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="flex h-screen overflow-hidden bg-slate-50">
        <AppProvider>
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
