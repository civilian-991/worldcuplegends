// Flag utilities - using CDN flag images for cross-platform compatibility
// Flag emojis don't render properly on Windows and some browsers

export const FLAG_BASE_URL = 'https://flagcdn.com';

export const countryCodeToFlag: Record<string, string> = {
  BR: 'br',
  AR: 'ar',
  FR: 'fr',
  DE: 'de',
  IT: 'it',
  NL: 'nl',
  PT: 'pt',
  ES: 'es',
  GB: 'gb-eng', // England specifically
  US: 'us',
  MX: 'mx',
  CA: 'ca',
};

export function getFlagUrl(countryCode: string, size: 'w20' | 'w40' | 'w80' | 'w160' = 'w40'): string {
  const code = countryCodeToFlag[countryCode] || countryCode.toLowerCase();
  return `${FLAG_BASE_URL}/${size}/${code}.png`;
}

export function getFlagSvgUrl(countryCode: string): string {
  const code = countryCodeToFlag[countryCode] || countryCode.toLowerCase();
  return `${FLAG_BASE_URL}/${code}.svg`;
}
