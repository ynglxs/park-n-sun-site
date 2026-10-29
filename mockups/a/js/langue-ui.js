// Balisage du sélecteur de langue à partir de optionsLangue() (shared/js/langues.js).
// La langue courante est marquée aria-current ; les autres sont « bientôt », non cliquables.
export function balisageLangues(options) {
  return options
    .map((l) => {
      if (l.courante) {
        return `<li><span class="langue" lang="${l.code}" aria-current="true" title="${l.libelle}">${l.court}</span></li>`;
      }
      if (!l.disponible) {
        return `<li><span class="langue langue-bientot" lang="${l.code}" aria-disabled="true">${l.court}<small lang="fr"> bientôt</small></span></li>`;
      }
      return `<li><a class="langue" lang="${l.code}" hreflang="${l.code}" href="#">${l.court}</a></li>`;
    })
    .join("");
}
