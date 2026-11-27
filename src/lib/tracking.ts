/* eslint-disable prefer-rest-params, prefer-spread -- the vendor pixel snippet relies on `arguments` */
/**
 * Browser tracking for the Meta (Facebook) Pixel.
 *
 * The Pixel ID comes from the dashboard (Store Settings). Events fired before
 * the settings have loaded are queued and sent once the pixel is initialised,
 * so no page view or product view is lost. If no pixel is configured, every
 * call is a no-op.
 *
 * The Purchase event_id must match the backend (orders/tracking.py) so Meta
 * deduplicates it against the server-side Conversions API.
 */

export interface TrackingConfig {
  facebookPixelId?: string | null;
}

export interface TrackedItem {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
}

const CURRENCY = "BDT";

let isReady = false;
let pending: Array<() => void> = [];
let active: TrackingConfig = {};

const w = () => (typeof window !== "undefined" ? (window as any) : null);

function dispatch(send: () => void) {
  if (!w()) return;
  if (isReady) {
    try { send(); } catch { /* tracking must never break the page */ }
  } else {
    pending.push(send);
  }
}

function loadMetaPixel(pixelId: string) {
  const win = w();
  if (win.fbq) return;
  const fbq: any = function () {
    if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
    else fbq.queue.push(arguments);
  };
  win.fbq = fbq;
  win._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
  win.fbq("init", pixelId);
}

/** Load the configured pixel and flush queued events. Call once the store settings are known. */
export function initTracking(config: TrackingConfig) {
  if (!w()) return;
  active = config;
  captureClickId();
  if (config.facebookPixelId) loadMetaPixel(config.facebookPixelId);
  isReady = true;
  const queued = pending;
  pending = [];
  queued.forEach((send) => { try { send(); } catch { /* ignore */ } });
}

function meta(event: string, data?: Record<string, unknown>, eventId?: string) {
  const win = w();
  if (!active.facebookPixelId || !win?.fbq) return;
  win.fbq("track", event, data ?? {}, eventId ? { eventID: eventId } : undefined);
}

const sumValue = (items: TrackedItem[]) => items.reduce((total, item) => total + item.price * item.quantity, 0);

const metaContents = (items: TrackedItem[]) => ({
  content_ids: items.map((i) => String(i.id)),
  contents: items.map((i) => ({ id: String(i.id), quantity: i.quantity, item_price: i.price })),
  content_type: "product",
  num_items: items.reduce((n, i) => n + i.quantity, 0),
});

export function trackPageView() {
  dispatch(() => meta("PageView"));
}

export function trackViewContent(item: TrackedItem) {
  dispatch(() => meta("ViewContent", { ...metaContents([item]), content_name: item.name, value: item.price, currency: CURRENCY }));
}

export function trackAddToCart(item: TrackedItem) {
  dispatch(() => meta("AddToCart", { ...metaContents([item]), content_name: item.name, value: item.price * item.quantity, currency: CURRENCY }));
}

export function trackInitiateCheckout(items: TrackedItem[]) {
  dispatch(() => meta("InitiateCheckout", { ...metaContents(items), value: sumValue(items), currency: CURRENCY }));
}

export function trackPurchase(orderNumber: string, value: number, items: TrackedItem[]) {
  dispatch(() => meta("Purchase", { ...metaContents(items), value, currency: CURRENCY, order_id: orderNumber }, `order-${orderNumber}`));
}

function readCookie(name: string) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/** Remember the Facebook ad click ID from the landing URL. */
function captureClickId() {
  try {
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    if (fbclid && !readCookie("_fbc")) {
      document.cookie = `_fbc=fb.1.${Date.now()}.${fbclid}; path=/; max-age=${90 * 24 * 3600}; SameSite=Lax`;
    }
  } catch { /* cookies may be blocked */ }
}

/** Browser identifiers sent with the order so the server-side event matches this visitor. */
export function getTrackingContext() {
  if (!w()) return {};
  return {
    url: window.location.href,
    fbp: readCookie("_fbp"),
    fbc: readCookie("_fbc"),
  };
}
