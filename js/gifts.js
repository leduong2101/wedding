export function getGiftDetails(gift) {
  if (!gift || !['qr', 'bank', 'account', 'holder'].every(key => typeof gift[key] === 'string' && gift[key].trim())) return null;
  const details = Object.fromEntries(['qr', 'bank', 'account', 'holder'].map(key => [key, gift[key].trim()]));
  if (!/^assets\/[a-zA-Z0-9_./-]+\.(png|jpe?g|webp)$/i.test(details.qr) || details.qr.includes('..')) return null;
  return details;
}
