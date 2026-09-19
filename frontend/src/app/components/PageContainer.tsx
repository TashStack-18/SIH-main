'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export function PageContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <div
      style={{
        flexGrow: 1,
        paddingTop: isHome ? 0 : '80px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  );
}
