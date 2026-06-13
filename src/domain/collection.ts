export function upsert<T extends Record<string, unknown>>(items: T[], item: T, key: keyof T) {
  const exists = items.some((current) => current[key] === item[key])
  return exists ? items.map((current) => current[key] === item[key] ? item : current) : [item, ...items]
}
