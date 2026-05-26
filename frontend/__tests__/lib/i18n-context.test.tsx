import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '@/lib/i18n-context';

function TestConsumer() {
  const { locale, toggle, t } = useLanguage();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="sample-text">{t.sidebar.overview}</span>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}

describe('LanguageProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders children', () => {
    render(
      <LanguageProvider>
        <span data-testid="child">Hello</span>
      </LanguageProvider>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('useLanguage returns default locale id', async () => {
    await act(async () => {
      render(
        <LanguageProvider>
          <TestConsumer />
        </LanguageProvider>
      );
    });
    expect(screen.getByTestId('locale').textContent).toBe('id');
  });

  it('toggle switches from id to en', async () => {
    await act(async () => {
      render(
        <LanguageProvider>
          <TestConsumer />
        </LanguageProvider>
      );
    });

    const button = screen.getByText('Toggle');
    await act(async () => {
      button.click();
    });

    expect(screen.getByTestId('locale').textContent).toBe('en');
  });

  it('t() returns correct translations for current locale', async () => {
    await act(async () => {
      render(
        <LanguageProvider>
          <TestConsumer />
        </LanguageProvider>
      );
    });

    // Default locale is id, sidebar.overview is "Overview" in both
    expect(screen.getByTestId('sample-text').textContent).toBe('Overview');

    const button = screen.getByText('Toggle');
    await act(async () => {
      button.click();
    });

    // English also has "Overview" for sidebar
    expect(screen.getByTestId('sample-text').textContent).toBe('Overview');
  });

  it('localStorage is set on toggle', async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    await act(async () => {
      render(
        <LanguageProvider>
          <TestConsumer />
        </LanguageProvider>
      );
    });

    const button = screen.getByText('Toggle');
    await act(async () => {
      button.click();
    });

    expect(setItemSpy).toHaveBeenCalledWith('locale', 'en');
  });

  it('reads locale from localStorage on mount', async () => {
    localStorage.setItem('locale', 'en');

    await act(async () => {
      render(
        <LanguageProvider>
          <TestConsumer />
        </LanguageProvider>
      );
    });

    expect(screen.getByTestId('locale').textContent).toBe('en');
  });

  it('translates landing hero title differently per locale', async () => {
    function HeroConsumer() {
      const { locale, toggle, t } = useLanguage();
      return (
        <div>
          <span data-testid="locale">{locale}</span>
          <span data-testid="hero-title">{t.landing.hero.title}</span>
          <button onClick={toggle}>Toggle</button>
        </div>
      );
    }

    await act(async () => {
      render(
        <LanguageProvider>
          <HeroConsumer />
        </LanguageProvider>
      );
    });

    expect(screen.getByTestId('hero-title').textContent).toBe('Platform Intelijen UMKM');

    const button = screen.getByText('Toggle');
    await act(async () => {
      button.click();
    });

    expect(screen.getByTestId('hero-title').textContent).toBe('The Leading UMKM Intelligence Platform');
  });
});
