'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { analytics } from '@/lib/analytics';

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    analytics.trackPageView(pathname);
  }, [pathname]);

  return null;
}
