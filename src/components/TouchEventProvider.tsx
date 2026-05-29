"use client";

import { useEffect, useRef } from "react";

interface TouchEventProviderProps {
  children: React.ReactNode;
}

/**
 * Global touch event provider that bypasses React's synthetic event system.
 * Uses native addEventListener on document.body for reliable mobile touch handling.
 * 
 * How it works:
 * - Elements with data-touch-action attribute get click/touch events
 * - data-touch-action="mood:celebrating" → calls window.__TOUCH_ACTIONS__['mood']({ mood: 'celebrating' })
 * - data-touch-action="dish:Char Siu" → calls window.__TOUCH_ACTIONS__['dish']({ dish: 'Char Siu' })
 */
export function TouchEventProvider({ children }: TouchEventProviderProps) {
  const isReadyRef = useRef(false);

  useEffect(() => {
    // Prevent double-initialization
    if (isReadyRef.current) return;
    isReadyRef.current = true;

    // Global handler using event delegation
    const handleTouch = (e: Event) => {
      const target = e.target as HTMLElement;
      const actionEl = target.closest('[data-touch-action]') as HTMLElement | null;
      
      if (!actionEl) return;
      
      const action = actionEl.getAttribute('data-touch-action');
      if (!action) return;
      
      console.log('[TouchEventProvider] action:', action);
      
      // Parse action format: "type:param"
      const [type, ...rest] = action.split(':');
      const param = rest.join(':');
      
      // Dispatch to registered handlers
      const handlers = (window as any).__TOUCH_ACTIONS__ || {};
      if (handlers[type]) {
        handlers[type](param, actionEl);
      }
    };

    // Use both click and touchend for maximum compatibility
    document.body.addEventListener('click', handleTouch, true);
    document.body.addEventListener('touchend', handleTouch, true);

    return () => {
      document.body.removeEventListener('click', handleTouch, true);
      document.body.removeEventListener('touchend', handleTouch, true);
    };
  }, []);

  return <>{children}</>;
}

// Helper to register actions
export function registerTouchAction(type: string, handler: (param: string, el: HTMLElement) => void) {
  if (typeof window === 'undefined') return;
  
  const w = window as any;
  if (!w.__TOUCH_ACTIONS__) {
    w.__TOUCH_ACTIONS__ = {};
  }
  w.__TOUCH_ACTIONS__[type] = handler;
}

// Helper to unregister
export function unregisterTouchAction(type: string) {
  if (typeof window === 'undefined') return;
  const w = window as any;
  if (w.__TOUCH_ACTIONS__) {
    delete w.__TOUCH_ACTIONS__[type];
  }
}
