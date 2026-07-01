export function formatNumber(value) {
  return new Intl.NumberFormat('pt-BR').format(value ?? 0);
}

export function formatDate(isoString) {
  if (!isoString) return '';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString));
}
