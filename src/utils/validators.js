export const NAME_MAX_LENGTH = 20;

export function isValidName(name) {
  const trimmed = (name ?? '').trim();
  return trimmed.length > 0 && trimmed.length <= NAME_MAX_LENGTH;
}

export function sanitizeName(name) {
  return (name ?? '').replace(/\s+/g, ' ').trim().slice(0, NAME_MAX_LENGTH);
}
