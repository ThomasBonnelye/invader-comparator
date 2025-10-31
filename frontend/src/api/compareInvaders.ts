export function compareInvaders(
  referenceInvaders: string[],
  others: Record<string, string[]>
): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  const refSet = new Set(referenceInvaders.map(s => s.trim()))

  for (const [playerName, invList] of Object.entries(others)) {
    const invSet = new Set((invList || []).map(s => s.trim()))
    const diff = [...invSet].filter(inv => !refSet.has(inv))
    result[playerName] = diff.sort()
  }

  return result
}
