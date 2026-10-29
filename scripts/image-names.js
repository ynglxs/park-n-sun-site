// Images de banque d'images (icônes Shutterstock) : droits non vérifiés, non reprises.
const EXCLUDED = [/-260nw-/];

export function isExcluded(file) {
  return EXCLUDED.some((re) => re.test(file));
}

// wp-content__uploads__2023__03__StreetDays-100.jpg → 2023-03-streetdays-100
export function imageSlug(file) {
  return file
    .replace(/^wp-content__uploads__/, "")
    .replace(/\.(jpe?g|png|webp|gif)$/i, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 60)
    .replace(/-+$/, "");
}
