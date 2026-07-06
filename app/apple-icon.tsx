import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
// Rendered on demand via the edge runtime — next/og needs edge on Netlify,
// and this avoids a build-time prerender that can fail cross-platform.
export const runtime = "edge";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          borderRadius: 40,
          color: "#E7C64E",
          fontFamily: "Georgia, serif",
          fontWeight: 700,
          fontSize: 120,
        }}
      >
        $
      </div>
    ),
    { ...size },
  );
}
