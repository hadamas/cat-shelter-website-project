import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/app/lib/site";
import { hero } from "@/app/content/home";

// Imagem que aparece ao compartilhar o link do site (WhatsApp, Instagram, Facebook...).
// Gerada no build a partir do logo e do título do Hero.
export const alt = `${siteConfig.name} — ${hero.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [chewy, logo] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Chewy-Regular.woff")),
    readFile(join(process.cwd(), "public/images/logo.png")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

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
          gap: 40,
          background: "#fef0e3",
          fontFamily: "Chewy",
        }}
      >
        <img src={logoSrc} width={507} height={295} alt="" />
        <div style={{ fontSize: 64, color: "#0095d2", textAlign: "center", padding: "0 60px" }}>
          {hero.title}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Chewy", data: chewy, style: "normal", weight: 400 }],
    },
  );
}
