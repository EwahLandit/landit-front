export const CURATED_FONTS: { value: string; label: string; stack: string; weights: string }[] = [
  { value: 'Inter',               label: 'Inter',               stack: "'Inter', sans-serif",               weights: '400;500;600;700' },
  { value: 'Plus Jakarta Sans',   label: 'Plus Jakarta Sans',   stack: "'Plus Jakarta Sans', sans-serif",   weights: '400;500;600;700;800' },
  { value: 'Outfit',              label: 'Outfit',              stack: "'Outfit', sans-serif",              weights: '400;500;600;700' },
  { value: 'Bricolage Grotesque', label: 'Bricolage Grotesque', stack: "'Bricolage Grotesque', sans-serif", weights: '400;500;600;700;800' },
  { value: 'Space Grotesk',       label: 'Space Grotesk',       stack: "'Space Grotesk', sans-serif",       weights: '400;500;600;700' },
  { value: 'Manrope',             label: 'Manrope',             stack: "'Manrope', sans-serif",             weights: '400;500;600;700;800' },
  { value: 'DM Sans',             label: 'DM Sans',             stack: "'DM Sans', sans-serif",             weights: '400;500;600;700' },
  { value: 'Syne',                label: 'Syne',                stack: "'Syne', sans-serif",                weights: '400;500;600;700;800' },
  { value: 'Raleway',             label: 'Raleway',             stack: "'Raleway', sans-serif",             weights: '400;500;600;700;800' },
  { value: 'Fraunces',            label: 'Fraunces',            stack: "'Fraunces', serif",                 weights: '400;500;600;700' },
];

export function buildFontLink(families: string[]): string {
  const unique = Array.from(new Set(families))
    .map(name => {
      const f = CURATED_FONTS.find(x => x.value === name);
      if (!f) return null;
      return `family=${encodeURIComponent(name).replace(/%20/g, '+')}:wght@${f.weights}`;
    })
    .filter(Boolean)
    .join('&');
  return `https://fonts.googleapis.com/css2?${unique}&display=swap`;
}
