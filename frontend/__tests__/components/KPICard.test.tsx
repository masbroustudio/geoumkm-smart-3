import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      // Filter out framer-motion-specific props
      const { initial, animate, transition, whileHover, whileTap, ...domProps } = props as Record<string, unknown>;
      return <div {...(domProps as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

import KPICard from '@/components/dashboard/KPICard';
import { Activity, TrendingUp } from 'lucide-react';

describe('KPICard', () => {
  it('renders label, value, and subtitle text', () => {
    render(
      <KPICard
        icon={Activity}
        label="Total UMKM"
        value="1,234"
        subtitle="Across all regions"
      />
    );

    expect(screen.getByText('Total UMKM')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('Across all regions')).toBeInTheDocument();
  });

  it('renders numeric value correctly', () => {
    render(
      <KPICard
        icon={TrendingUp}
        label="Average Score"
        value={85}
        subtitle="Out of 100"
      />
    );

    expect(screen.getByText('85')).toBeInTheDocument();
  });

  it('trend=up shows up arrow', () => {
    const { container } = render(
      <KPICard
        icon={Activity}
        label="Growth"
        value="15%"
        subtitle="Year over year"
        trend="up"
      />
    );

    // ArrowUpRight icon from lucide-react renders as SVG
    const upArrow = container.querySelector('.text-emerald-400');
    expect(upArrow).toBeInTheDocument();
  });

  it('trend=down shows down arrow', () => {
    const { container } = render(
      <KPICard
        icon={Activity}
        label="Decline"
        value="-5%"
        subtitle="Quarter over quarter"
        trend="down"
      />
    );

    // ArrowDownRight icon renders with text-red-400 class
    const downArrow = container.querySelector('.text-red-400');
    expect(downArrow).toBeInTheDocument();
  });

  it('trend=neutral shows no arrow indicators', () => {
    const { container } = render(
      <KPICard
        icon={Activity}
        label="Stable"
        value="100"
        subtitle="No change"
        trend="neutral"
      />
    );

    expect(container.querySelector('.text-emerald-400')).not.toBeInTheDocument();
    expect(container.querySelector('.text-red-400')).not.toBeInTheDocument();
  });
});
