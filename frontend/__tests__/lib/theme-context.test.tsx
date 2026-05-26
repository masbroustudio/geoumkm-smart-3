import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/lib/theme-context';

function TestConsumer() {
  const { theme, toggle } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Reset localStorage and document classes
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'light');
  });

  it('renders children', () => {
    render(
      <ThemeProvider>
        <span data-testid="child">Hello</span>
      </ThemeProvider>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('useTheme returns default theme dark', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>
      );
    });
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('toggle switches from dark to light', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>
      );
    });

    const button = screen.getByText('Toggle');
    await act(async () => {
      button.click();
    });

    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('localStorage is set on toggle', async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    await act(async () => {
      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>
      );
    });

    const button = screen.getByText('Toggle');
    await act(async () => {
      button.click();
    });

    expect(setItemSpy).toHaveBeenCalledWith('theme', 'light');
  });

  it('reads theme from localStorage on mount', async () => {
    localStorage.setItem('theme', 'light');

    await act(async () => {
      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>
      );
    });

    expect(screen.getByTestId('theme').textContent).toBe('light');
  });
});
