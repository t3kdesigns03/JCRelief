import { ImageResponse } from "next/og";

export const alt = "Debt Angel — Smarter, Faster, Cheaper. Your Debt Zero.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Required so the image pre-renders to a static PNG under `output: export`.
export const dynamic = "force-static";

const mark = `
<svg width="260" height="260" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F3E7BE"/>
      <stop offset="45%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#C9A227"/>
    </linearGradient>
  </defs>
  <circle cx="32" cy="31" r="22" fill="none" stroke="#0D8A5C" stroke-width="3" opacity="0.4"/>
  <circle cx="32" cy="31" r="21" fill="none" stroke="url(#g)" stroke-width="2.4" opacity="0.6"/>
  <path d="M31 40 C22 28 15 25 5 25 C12 28 13 31 11 35 C17 33 18 36 18 40 C23 37 27 38 31 43 Z" fill="url(#g)"/>
  <path d="M33 40 C42 28 49 25 59 25 C52 28 51 31 53 35 C47 33 46 36 46 40 C41 37 37 38 33 43 Z" fill="url(#g)"/>
  <text x="32" y="34" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-weight="700" font-size="26" fill="url(#g)">$</text>
</svg>`;

export default function OpengraphImage() {
  const markSrc = `data:image/svg+xml;utf8,${encodeURIComponent(mark)}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(120% 120% at 50% 0%, #0D3325 0%, #0A0A0A 55%, #0A0A0A 100%)",
          color: "#FAFAF7",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markSrc} width={230} height={230} alt="" />
        <div
          style={{
            display: "flex",
            marginTop: 8,
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ color: "#D4AF37" }}>Debt</span>
          <span style={{ color: "#FAFAF7" }}>Angel</span>
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 32,
            color: "#00C77F",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 600,
          }}
        >
          Smarter, Faster, Cheaper.
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 26,
            color: "rgba(250,250,247,0.7)",
            fontFamily: "Helvetica, Arial, sans-serif",
          }}
        >
          Your Debt Zero with the least amount of risk.
        </div>
      </div>
    ),
    { ...size },
  );
}
