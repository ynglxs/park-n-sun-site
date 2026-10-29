import { describe, expect, it } from "vitest";
import { enKio, estPolice, resumePoids } from "../scripts/poids-resume.js";

describe("estPolice", () => {
  it("reconnaît les polices par type ou par hôte Google Fonts", () => {
    expect(estPolice({ url: "https://x/a.woff2", type: "font/woff2" })).toBe(
      true,
    );
    expect(estPolice({ url: "https://fonts.gstatic.com/s/x", type: "" })).toBe(
      true,
    );
    expect(estPolice({ url: "https://x/a.webp", type: "image/webp" })).toBe(
      false,
    );
  });
});

describe("resumePoids", () => {
  it("additionne les octets et isole la part des polices", () => {
    const r = resumePoids([
      { url: "a.html", type: "text/html", octets: 1000 },
      { url: "b.woff2", type: "font/woff2", octets: 3000 },
      { url: "c.webp", type: "image/webp", octets: 2000 },
    ]);
    expect(r).toEqual({ total: 6000, requetes: 3, polices: 3000 });
  });
});

describe("enKio", () => {
  it("arrondit en kibioctets", () => {
    expect(enKio(2048)).toBe(2);
    expect(enKio(1536)).toBe(2);
  });
});
