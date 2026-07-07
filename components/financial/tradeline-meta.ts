import {
  CreditCard,
  Landmark,
  Stethoscope,
  Store,
  Wallet,
} from "lucide-react";
import type { Tradeline } from "@/lib/estimator";

export const TRADELINE_TYPE_META: Record<
  Tradeline["type"],
  { label: string; Icon: typeof CreditCard }
> = {
  "credit-card": { label: "Credit card", Icon: CreditCard },
  "retail-card": { label: "Retail card", Icon: Store },
  "personal-loan": { label: "Personal loan", Icon: Landmark },
  medical: { label: "Medical", Icon: Stethoscope },
  other: { label: "Other unsecured", Icon: Wallet },
};

export const TRADELINE_STATUS_META: Record<
  Tradeline["status"],
  { label: string; className: string }
> = {
  current: {
    label: "Current",
    className: "bg-money/15 text-money ring-1 ring-money/30",
  },
  "past-due": {
    label: "Past due",
    className: "bg-gold/15 text-gold ring-1 ring-gold/35",
  },
  collections: {
    label: "In collections",
    className: "bg-destructive/15 text-destructive ring-1 ring-destructive/35",
  },
};

export const UTILIZATION_BAND_STYLES: Record<
  "good" | "watch" | "high",
  { bar: string; text: string; track: string }
> = {
  good: {
    bar: "bg-money-sheen",
    text: "text-money",
    track: "bg-money/10",
  },
  watch: {
    bar: "bg-gold-sheen",
    text: "text-gold",
    track: "bg-gold/10",
  },
  high: {
    bar: "bg-destructive",
    text: "text-destructive",
    track: "bg-destructive/10",
  },
};

export function formatOpened(iso: string): string {
  const [y, m] = iso.split("-");
  if (!y) return iso;
  if (!m) return y;
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const mi = parseInt(m, 10) - 1;
  return `${months[mi] ?? m} ${y}`;
}
