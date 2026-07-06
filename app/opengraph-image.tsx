import { ImageResponse } from "next/og";

export const alt = "Debt Angel — Smarter, Faster, Cheaper. Your Debt Zero.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Rendered on demand via the edge runtime — next/og needs edge on Netlify,
// and this avoids a build-time prerender that can fail cross-platform.
export const runtime = "edge";

export default function OpengraphImage() {
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
        <div
          style={{
            display: "flex",
            fontSize: 118,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ color: "#E7C64E" }}>Debt</span>
          <span style={{ color: "#FAFAF7" }}>Angel</span>
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 34,
            color: "#00C77F",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 600,
          }}
        >
          Smarter, Faster, Cheaper.
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 27,
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
