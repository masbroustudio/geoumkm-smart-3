const isEnabled = typeof process !== 'undefined' && !!process.env.NEXT_PUBLIC_APPINSIGHTS_KEY;

function trackPageView(pageName: string): void {
  if (!isEnabled) return;
  console.log('[Analytics] Page View:', pageName);
}

function trackEvent(eventName: string, properties?: Record<string, string>): void {
  if (!isEnabled) return;
  console.log('[Analytics] Event:', eventName, properties || {});
}

function trackError(error: Error, context?: string): void {
  if (!isEnabled) return;
  console.log('[Analytics] Error:', error.message, context ? `(${context})` : '');
}

export const analytics = { trackPageView, trackEvent, trackError };
