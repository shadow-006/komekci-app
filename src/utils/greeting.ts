export function greetingForHour(hour: number): string {
  if (hour < 6) return 'Sağlam gecə';
  if (hour < 12) return 'Sabahınız xeyir';
  if (hour < 18) return 'Gününüz xeyir';
  return 'Axşamınız xeyir';
}
