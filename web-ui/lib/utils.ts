// utils.ts

function displayShortPublicKey(base58: string): string {
  if (base58.length === 44) {
    return `0x${base58.slice(0, 4)}..${base58.slice(-4)}`;
  }
  return "";
}

export { displayShortPublicKey };
