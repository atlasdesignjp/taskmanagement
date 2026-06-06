import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context';
import TabBar from '@/components/TabBar';

export const metadata: Metadata = {
  title: 'タスク管理',
  description: 'シンプルなタスク管理アプリ',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="flex flex-col h-screen overflow-hidden bg-slate-50">
        <AppProvider>
          <TabBar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
