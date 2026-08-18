import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

import { copyText } from "@/lib/dictionary";
import { site } from "@/content/site";

/*
  Previously implied by generateStaticParams over the three locales. With one
  language there are no params, so under `output: "export"` the route has to say
  for itself that it is static — otherwise the build refuses it as dynamic.
*/
export const dynamic = "force-static";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — Durrës, Albania`;

/**
 * This card is what renders when someone forwards the link on WhatsApp, which
 * is how most of this site's traffic will actually spread. Worth having the
 * photo in it rather than a bare title.
 */
export default async function OpenGraphImage() {
  const photo = await readFile(
    path.join(process.cwd(), "public", "photos", "hero-window.jpg"),
  );
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#0d1b22",
        }}
      >
        <img
          src={photoSrc}
          width={size.width}
          height={size.height}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(10,24,32,0.15) 0%, rgba(10,24,32,0.55) 55%, rgba(10,24,32,0.9) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: 72,
            width: "100%",
            height: "100%",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              fontSize: 24,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.8)",
              marginBottom: 20,
            }}
          >
            {copyText.hero.eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 76,
              lineHeight: 1.05,
              maxWidth: 900,
            }}
          >
            {copyText.hero.titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 28,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {site.name}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
