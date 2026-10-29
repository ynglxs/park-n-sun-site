import { describe, expect, it } from "vitest";
import { imageSlug, isExcluded } from "../scripts/image-names.js";

describe("imageSlug", () => {
  it("retire le préfixe WordPress et garde l'année et le mois", () => {
    expect(imageSlug("wp-content__uploads__2023__03__StreetDays-100.jpg")).toBe(
      "2023-03-streetdays-100",
    );
  });

  it("produit un nom court et sans caractères spéciaux", () => {
    const slug = imageSlug(
      "media__bde9d1_a45894cf~mv2_d_5000_3480_s_4_2.png__v1__crop__x_0,y_0__White%20on%20Transparent.webp",
    );
    expect(slug).toMatch(/^[a-z0-9-]+$/);
    expect(slug.length).toBeLessThanOrEqual(60);
  });
});

describe("isExcluded", () => {
  it("écarte les icônes de banque d'images", () => {
    expect(
      isExcluded(
        "wp-content__uploads__2021__09__solid-skateboard-icon-260nw-731569648.jpg",
      ),
    ).toBe(true);
    expect(isExcluded("wp-content__uploads__2026__04__IMG_9630.jpg")).toBe(
      false,
    );
  });
});
