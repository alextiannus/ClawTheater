/**
 * Centralized GA4 analytics utility for Claw Theater.
 * All event names and parameter shapes are defined here
 * to ensure consistency across the codebase.
 *
 * Uses sendGAEvent from @next/third-parties/google under the hood.
 * For User ID setting, we call window.gtag directly (not exposed by the package).
 */
import { sendGAEvent } from '@next/third-parties/google';

// ─── Helper ─────────────────────────────────────────────────────────────────

function safeGtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag(...args);
  }
}

// ─── A. Global / Identity ────────────────────────────────────────────────────

/**
 * A1 – Set User ID for cross-session identity stitching.
 * Must be called after login succeeds and we have an internal userId.
 * Do NOT pass PII (email, phone, wallet address).
 */
export function setGAUserId(userId: string) {
  safeGtag('set', { user_id: userId });
}

/**
 * A2 – Manual page_view for SPA route changes.
 * Called by SpaPageViewTracker on pathname change.
 */
export function trackPageView(pagePath: string) {
  sendGAEvent({ event: 'page_view', page_path: pagePath });
}

// ─── B. Growth Core ──────────────────────────────────────────────────────────

/**
 * B1 – Join Discord / community link click.
 */
export function trackJoinDiscordClick(params: {
  link_url: string;
  location: 'header' | 'footer' | 'hero' | 'novel_page' | 'chapter_end' | 'popup' | 'market_page';
  campaign?: string;
}) {
  sendGAEvent({ event: 'join_discord_click', ...params });
}

/**
 * B2 – Registration success (GA4 recommended event name).
 */
export function trackSignUp(params: {
  method: 'email' | 'google' | 'github' | 'wallet' | 'privy_sync';
  location?: 'header' | 'modal' | 'paywall' | 'tip_modal';
}) {
  sendGAEvent({ event: 'sign_up', ...params });
}

/**
 * B3 – Login success (GA4 recommended event name).
 */
export function trackLogin(params: {
  method: 'email' | 'google' | 'github' | 'wallet' | 'privy_sync';
}) {
  sendGAEvent({ event: 'login', ...params });
}

// ─── C. Content Funnel ───────────────────────────────────────────────────────

/**
 * C1 – Novel detail page viewed (GA4 e-commerce: view_item).
 */
export function trackViewItem(params: {
  item_id: string;
  item_name: string;
  item_category?: string;
  author?: string;
}) {
  sendGAEvent({
    event: 'view_item',
    items: [params],
  });
}

/**
 * C2 – Chapter reading page loaded (GA4: select_content / view_content).
 */
export function trackViewContent(params: {
  novel_id: string;
  chapter_id: string;
  chapter_no: number;
  title?: string;
}) {
  sendGAEvent({
    event: 'view_content',
    content_type: 'chapter',
    ...params,
  });
}

/**
 * C3 – User scrolled to end of chapter (read complete).
 */
export function trackReadComplete(params: {
  novel_id: string;
  chapter_id: string;
  chapter_no: number;
  progress: number;
}) {
  sendGAEvent({ event: 'read_complete', ...params });
}

/**
 * C4 – Next chapter button clicked.
 * Includes chapter numbers and click origin for deeper funnel analysis.
 */
export function trackNextChapterClick(params: {
  novel_id: string;
  from_chapter_id: string;
  to_chapter_id: string;
  from_chapter_no?: number;
  to_chapter_no?: number;
  location?: 'chapter_end' | 'floating_button' | 'toc';
}) {
  sendGAEvent({ event: 'next_chapter_click', ...params });
}

// ─── D. Monetisation Funnel ──────────────────────────────────────────────────

/**
 * D1 – Paywall / unlock prompt shown.
 */
export function trackPaywallView(params: {
  novel_id: string;
  chapter_id: string;
  reason: 'locked_chapter' | 'subscription_required';
  location?: 'chapter_page' | 'chapter_end' | 'popup';
}) {
  sendGAEvent({ event: 'paywall_view', ...params });
}

/**
 * D2 – User clicks "buy / unlock / go to checkout".
 */
export function trackBeginCheckout(params: {
  currency: string;
  value: number;
  location?: 'chapter_unlock' | 'novel_tip' | 'deposit_modal';
  items?: Array<{
    item_id: string;
    item_name: string;
    price: number;
    quantity: number;
  }>;
}) {
  sendGAEvent({ event: 'begin_checkout', ...params });
}

/**
 * D3 – Payment confirmed (trigger on success callback page, not click).
 */
export function trackPurchase(params: {
  transaction_id: string;
  currency: string;
  value: number;
  items?: Array<{
    item_id: string;
    item_name: string;
    price: number;
    quantity: number;
  }>;
  coupon?: string;
}) {
  sendGAEvent({ event: 'purchase', ...params });
}

/**
 * D4 – Tip / donate in Claw Coins.
 */
export function trackDonate(params: {
  novel_id: string;
  value: number;
  currency: string;
}) {
  sendGAEvent({ event: 'donate', ...params });
}

// ─── E. Share / Outbound ─────────────────────────────────────────────────────

/**
 * E1 – Share button clicked.
 */
export function trackShare(params: {
  method: 'copy_link' | 'x' | 'whatsapp' | 'telegram' | 'native';
  content_type: 'novel' | 'chapter' | 'bounty' | 'agent';
  novel_id?: string;
  chapter_id?: string;
}) {
  sendGAEvent({ event: 'share', ...params });
}

/**
 * E2 – Outbound link clicked.
 */
export function trackOutboundClick(params: {
  link_url: string;
  location: string;
}) {
  sendGAEvent({ event: 'outbound_click', ...params });
}
