const IMAGE = /\.(jpe?g|png|webp|gif)$/i;

export function isImage(file) {
  return IMAGE.test(file);
}

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

// Associe chaque fichier à son nom court ; échoue si deux sources donnent le même nom
// (sinon la seconde écraserait silencieusement la première).
export function slugsUniques(files) {
  const parSlug = new Map();
  for (const file of files) {
    const slug = imageSlug(file);
    if (parSlug.has(slug)) {
      throw new Error(
        `Nom d'image en double « ${slug} » : ${parSlug.get(slug)} et ${file}`,
      );
    }
    parSlug.set(slug, file);
  }
  return parSlug;
}
