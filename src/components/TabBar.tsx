'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/today', label: 'Today' },
  { href: '/all', label: 'All' },
  { href: '/completed', label: 'Completed' },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <div className="flex bg-white border-b border-slate-200 sticky top-0 z-10">
      {tabs.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
            pathname === href
              ? 'text-blue-500 border-blue-500'
              : 'text-slate-500 border-transparent'
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
