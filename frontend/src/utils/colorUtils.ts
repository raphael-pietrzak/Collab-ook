/**
 * Génère une couleur déterministe basée sur une chaîne de caractères
 * @param str Identifiant unique (comme userId)
 * @returns Une couleur au format hexadécimal
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Générer une couleur vive mais pas trop claire
  const h = Math.abs(hash) % 360;
  const s = 60 + Math.abs(hash % 30); // Entre 60% et 90%
  const l = 45 + Math.abs(hash % 10); // Entre 45% et 55%

  return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * Détermine si une couleur est claire ou foncée
 * @param color Couleur au format HSL
 * @returns true si la couleur est claire
 */
export function isLightColor(color: string): boolean {
  // Extraction de la luminosité du HSL
  const match = color.match(/hsl\(\d+,\s*\d+%,\s*(\d+)%\)/);
  if (match) {
    const lightness = parseInt(match[1], 10);
    return lightness > 60;
  }
  return false;
}

/**
 * Retourne une couleur de texte contrastante (blanc ou noir) pour un fond donné
 * @param backgroundColor Couleur d'arrière-plan
 * @returns '#ffffff' ou '#000000'
 */
export function getContrastTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#000000' : '#ffffff';
}
