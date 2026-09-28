export const RLS_COUNTRIES = ['Brazil', 'United States', 'China', 'Germany', 'South Korea'] as const

export type RlsCountry = (typeof RLS_COUNTRIES)[number]

export function isRlsCountry(value: unknown): value is RlsCountry {
  return typeof value === 'string' && (RLS_COUNTRIES as readonly string[]).includes(value)
}
