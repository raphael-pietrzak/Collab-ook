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
 * Génère une couleur hexadécimale unique basée sur l'ID utilisateur
 * @param userId Identifiant unique de l'utilisateur
 * @returns Couleur au format hexadécimal (#RRGGBB)
 */
export function generateUserColor(userId: string): string {
  // Liste de couleurs vives prédéfinies (pour meilleure visibilité)
  const colors = [
    '#FF5733', // Rouge-orangé
    '#33FF57', // Vert vif
    '#3357FF', // Bleu
    '#FF33A8', // Rose
    '#33FFF9', // Cyan
    '#F9FF33', // Jaune
    '#A833FF', // Violet
    '#FF8C33', // Orange
    '#33FFB8', // Turquoise
    '#8CFF33'  // Vert lime
  ];
  
  // Génération d'un nombre basé sur la chaîne utilisateur
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Sélection d'une couleur dans la palette
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Détermine si une couleur est claire ou foncée
 * @param color Couleur au format hexadécimal
 * @returns true si la couleur est claire
 */
export function isLightColor(color: string): boolean {
  // Conversion hex en RGB
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  
  // Calcul de la luminosité (formule YIQ)
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  // Si la luminosité est supérieure à 128, la couleur est considérée comme claire
  return yiq > 128;
}

/**
 * Retourne une couleur de texte contrastante (blanc ou noir) pour un fond donné
 * @param backgroundColor Couleur d'arrière-plan
 * @returns '#ffffff' ou '#000000'
 */
export function getContrastTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#000000' : '#ffffff';
}
